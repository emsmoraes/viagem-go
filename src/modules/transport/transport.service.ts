import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { TransportRepository } from './repositories/transport.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransportService {
  constructor(
    private readonly transportRepository: TransportRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createTransportDto: CreateTransportDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createTransportDto.proposalId },
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
            this.envService.get('S3_TRANSPORT_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_TRANSPORT_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const transportData: Prisma.TransportCreateInput = {
      type: createTransportDto.type,
      description: createTransportDto.description,
      price: createTransportDto.price,
      proposal: {
        connect: { id: createTransportDto.proposalId },
      },
      imageUrls: imageUrls,
      pdfUrls: pdfUrls,
    };

    return await this.transportRepository.create(transportData);
  }

  async findAll(proposalId: string) {
    return await this.transportRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const transport = await this.transportRepository.findOne(id, proposalId);

    if (!transport) {
      throw new NotFoundException('Transporte não encontrado');
    }

    return transport;
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
        folder: this.envService.get('S3_TRANSPORT_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por transporte',
      },
      pdf: {
        folder: this.envService.get('S3_TRANSPORT_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por transporte',
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
    updateTransportDto: UpdateTransportDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const transport = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      transport.imageUrls,
      updateTransportDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      transport.pdfUrls,
      updateTransportDto.pdfUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const transportData: Prisma.TransportUpdateInput = {
      type: updateTransportDto.type,
      description: updateTransportDto.description,
      price: updateTransportDto.price,
      imageUrls: updatedImages,
      pdfUrls: updatedPdfs,
    };

    return await this.transportRepository.update(id, transportData);
  }

  async remove(id: string, proposalId: string) {
    const transport = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_TRANSPORT_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_TRANSPORT_PDFS_FOLDER_PATH');

    await Promise.all(
      transport.imageUrls.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, imagesFolder);
        return this.awsService.delete(fileName, imagesFolder);
      }),
    );

    await Promise.all(
      transport.pdfUrls.map((pdfUrl) => {
        const fileName = extractFileName(pdfUrl, pdfsFolder);
        return this.awsService.delete(fileName, pdfsFolder);
      }),
    );

    return await this.transportRepository.remove(id);
  }
}