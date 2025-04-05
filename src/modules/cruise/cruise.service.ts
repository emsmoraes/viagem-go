// cruise.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCruiseDto } from './dto/create-cruise.dto';
import { UpdateCruiseDto } from './dto/update-cruise.dto';
import { CruiseRepository } from './repositories/cruise.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class CruiseService {
  constructor(
    private readonly cruiseRepository: CruiseRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createCruiseDto: CreateCruiseDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createCruiseDto.proposalId },
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
            this.envService.get('S3_CRUISE_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_CRUISE_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const cruiseData: Prisma.CruiseCreateInput = {
      name: createCruiseDto.name,
      cabin: createCruiseDto.cabin,
      checkIn: createCruiseDto.checkIn,
      checkOut: createCruiseDto.checkOut,
      route: createCruiseDto.route,
      description: createCruiseDto.description,
      paymentMethods: createCruiseDto.paymentMethods,
      proposal: {
        connect: { id: createCruiseDto.proposalId },
      },
      images: imageUrls.length > 0 ? imageUrls : undefined,
      files: pdfUrls.length > 0 ? pdfUrls : undefined,
    };

    return await this.cruiseRepository.create(cruiseData);
  }

  async findAll(proposalId: string) {
    return await this.cruiseRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const cruise = await this.cruiseRepository.findOne(id, proposalId);

    if (!cruise) {
      throw new NotFoundException('Cruzeiro não encontrado');
    }

    return cruise;
  }

  async update(
    id: string,
    proposalId: string,
    updateCruiseDto: UpdateCruiseDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const cruise = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      cruise.images ?? [],
      updateCruiseDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      cruise.files ?? [],
      updateCruiseDto.fileUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const cruiseData: Prisma.CruiseUpdateInput = {
      name: updateCruiseDto.name,
      cabin: updateCruiseDto.cabin,
      checkIn: updateCruiseDto.checkIn,
      checkOut: updateCruiseDto.checkOut,
      route: updateCruiseDto.route,
      description: updateCruiseDto.description,
      paymentMethods: updateCruiseDto.paymentMethods,
      images: updatedImages,
      files: updatedPdfs,
    };

    return await this.cruiseRepository.update(id, cruiseData);
  }

  async remove(id: string, proposalId: string) {
    const cruise = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_CRUISE_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_CRUISE_PDFS_FOLDER_PATH');

    if (cruise.images?.length) {
      await Promise.all(
        cruise.images.map((imageUrl) => {
          const fileName = extractFileName(imageUrl, imagesFolder);
          return this.awsService.delete(fileName, imagesFolder);
        }),
      );
    }

    if (cruise.files?.length) {
      await Promise.all(
        cruise.files.map((pdfUrl) => {
          const fileName = extractFileName(pdfUrl, pdfsFolder);
          return this.awsService.delete(fileName, pdfsFolder);
        }),
      );
    }

    return await this.cruiseRepository.remove(id);
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
        folder: this.envService.get('S3_CRUISE_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por cruzeiro',
      },
      pdf: {
        folder: this.envService.get('S3_CRUISE_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por cruzeiro',
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
}