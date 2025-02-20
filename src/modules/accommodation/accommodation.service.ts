import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AccommodationRepository } from './repositories/accommodation.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccommodationService {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createAccommodationDto: CreateAccommodationDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createAccommodationDto.proposalId },
    });

    if (!proposal) {
      throw new BadRequestException('Proposta não encontrada');
    }

    let imageUrls: string[] = [];
    let pdfUrls: string[] = [];

    if (imageFiles?.length) {
      imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fileName = `${crypto.randomUUID()}.webp`;
          return this.awsService.post(
            fileName,
            file.buffer,
            this.envService.get('S3_ACCOMMODATION_IMAGES_FOLDER_PATH'),
          );
        }),
      );
    }

    if (pdfFiles?.length) {
      pdfUrls = await Promise.all(
        pdfFiles.map(async (file) => {
          const fileName = `${crypto.randomUUID()}.pdf`;
          return this.awsService.post(
            fileName,
            file.buffer,
            this.envService.get('S3_ACCOMMODATION_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const accommodationData: Prisma.AccommodationCreateInput = {
      name: createAccommodationDto.name,
      location: createAccommodationDto.location,
      address: createAccommodationDto.address,
      checkIn: createAccommodationDto.checkIn,
      checkOut: createAccommodationDto.checkOut,
      category: createAccommodationDto.category,
      boardType: createAccommodationDto.boardType,
      roomType: createAccommodationDto.roomType,
      description: createAccommodationDto.description,
      price: createAccommodationDto.price,
      proposal: {
        connect: { id: createAccommodationDto.proposalId },
      },
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      pdfUrls: pdfUrls.length > 0 ? pdfUrls : undefined,
    };

    return await this.accommodationRepository.create(accommodationData);
  }

  async findAll(proposalId: string) {
    return await this.accommodationRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const accommodation = await this.accommodationRepository.findOne(
      id,
      proposalId,
    );

    if (!accommodation) {
      throw new NotFoundException('Hospedagem não encontrada');
    }

    return accommodation;
  }

  private async processFiles<T extends 'image' | 'pdf'>(
    id: string,
    storedUrls: string[],
    updatedUrls: string[],
    newFiles: Express.Multer.File[] | undefined,
    type: T,
  ) {
    const config = {
      image: {
        folder: this.envService.get('S3_ACCOMMODATION_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por hospedagem',
      },
      pdf: {
        folder: this.envService.get('S3_ACCOMMODATION_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por hospedagem',
      },
    };

    const filesToDelete = storedUrls.filter(
      (url) => !updatedUrls.includes(url),
    );
    await this.deleteFiles(filesToDelete, config[type].folder);

    if (newFiles?.length) {
      const totalFiles = updatedUrls.length + newFiles.length;
      if (totalFiles > config[type].maxFiles) {
        throw new BadRequestException(config[type].errorMessage);
      }

      const newUrls = await this.uploadFiles(
        id,
        newFiles,
        config[type].folder,
        config[type].extension,
      );
      updatedUrls.push(...newUrls);
    }

    return updatedUrls;
  }

  private async deleteFiles(urls: string[], folder: string) {
    return Promise.all(
      urls.map((url) => {
        const fileName = extractFileName(url, folder);
        return this.awsService.delete(fileName, folder);
      }),
    );
  }

  private async uploadFiles(
    id: string,
    files: Express.Multer.File[],
    folder: string,
    extension: string,
  ) {
    return Promise.all(
      files.map(async (file) => {
        const fileName = `${id}-${crypto.randomUUID()}.${extension}`;
        return this.awsService.post(fileName, file.buffer, folder);
      }),
    );
  }

  async update(
    id: string,
    proposalId: string,
    updateAccommodationDto: UpdateAccommodationDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const accommodation = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      accommodation.imageUrls ?? [],
      updateAccommodationDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      accommodation.pdfUrls ?? [],
      updateAccommodationDto.pdfUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const accommodationData: Prisma.AccommodationUpdateInput = {
      name: updateAccommodationDto.name,
      location: updateAccommodationDto.location,
      address: updateAccommodationDto.address,
      checkIn: updateAccommodationDto.checkIn,
      checkOut: updateAccommodationDto.checkOut,
      category: updateAccommodationDto.category,
      boardType: updateAccommodationDto.boardType,
      roomType: updateAccommodationDto.roomType,
      description: updateAccommodationDto.description,
      price: updateAccommodationDto.price,
      imageUrls: updatedImages,
      pdfUrls: updatedPdfs,
    };

    return await this.accommodationRepository.update(id, accommodationData);
  }

  async remove(id: string, proposalId: string) {
    const accommodation = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_ACCOMMODATION_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_ACCOMMODATION_PDFS_FOLDER_PATH');

    if (accommodation.imageUrls?.length) {
      await Promise.all(
        accommodation.imageUrls.map((imageUrl) => {
          const fileName = extractFileName(imageUrl, imagesFolder);
          return this.awsService.delete(fileName, imagesFolder);
        }),
      );
    }

    if (accommodation.pdfUrls?.length) {
      await Promise.all(
        accommodation.pdfUrls.map((pdfUrl) => {
          const fileName = extractFileName(pdfUrl, pdfsFolder);
          return this.awsService.delete(fileName, pdfsFolder);
        }),
      );
    }

    return await this.accommodationRepository.remove(id);
  }
} 