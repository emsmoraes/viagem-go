import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ExtraRepository } from './repositories/extra.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExtraService {
  constructor(
    private readonly extraRepository: ExtraRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createExtraDto: CreateExtraDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createExtraDto.proposalId },
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
            this.envService.get('S3_EXTRA_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_EXTRA_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const extraData: Prisma.ExtraCreateInput = {
      title: createExtraDto.title,
      description: createExtraDto.description,
      price: createExtraDto.price,
      proposal: {
        connect: { id: createExtraDto.proposalId },
      },
      images: imageUrls,
      files: pdfUrls,
    };

    return await this.extraRepository.create(extraData);
  }

  async findAll(proposalId: string) {
    return await this.extraRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const extra = await this.extraRepository.findOne(id, proposalId);

    if (!extra) {
      throw new NotFoundException('Extra não encontrado');
    }

    return extra;
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
        folder: this.envService.get('S3_EXTRA_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por extra',
      },
      pdf: {
        folder: this.envService.get('S3_EXTRA_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por extra',
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
    updateExtraDto: UpdateExtraDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const extra = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      extra.images,
      updateExtraDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      extra.files,
      updateExtraDto.fileUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const extraData: Prisma.ExtraUpdateInput = {
      title: updateExtraDto.title,
      description: updateExtraDto.description,
      price: updateExtraDto.price,
      images: updatedImages,
      files: updatedPdfs,
    };

    return await this.extraRepository.update(id, extraData);
  }

  async remove(id: string, proposalId: string) {
    const extra = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_EXTRA_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_EXTRA_PDFS_FOLDER_PATH');

    await Promise.all(
      extra.images.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, imagesFolder);
        return this.awsService.delete(fileName, imagesFolder);
      }),
    );

    await Promise.all(
      extra.files.map((pdfUrl) => {
        const fileName = extractFileName(pdfUrl, pdfsFolder);
        return this.awsService.delete(fileName, pdfsFolder);
      }),
    );

    return await this.extraRepository.remove(id);
  }
}
