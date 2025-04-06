import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceRepository } from './repositories/experience.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createExperienceDto: CreateExperienceDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createExperienceDto.proposalId },
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
            this.envService.get('S3_EXPERIENCE_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_EXPERIENCE_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const experienceData: Prisma.ExperienceCreateInput = {
      type: createExperienceDto.type,
      description: createExperienceDto.description,
      price: createExperienceDto.price,
      proposal: {
        connect: { id: createExperienceDto.proposalId },
      },
      images: imageUrls,
      files: pdfUrls,
    };

    return await this.experienceRepository.create(experienceData);
  }

  async findAll(proposalId: string) {
    return await this.experienceRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const experience = await this.experienceRepository.findOne(id, proposalId);

    if (!experience) {
      throw new NotFoundException('Experiência não encontrada');
    }

    return experience;
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
        folder: this.envService.get('S3_EXPERIENCE_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por experiência',
      },
      pdf: {
        folder: this.envService.get('S3_EXPERIENCE_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por experiência',
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
    updateExperienceDto: UpdateExperienceDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const experience = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      experience.images,
      updateExperienceDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      experience.files,
      updateExperienceDto.fileUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const experienceData: Prisma.ExperienceUpdateInput = {
      type: updateExperienceDto.type,
      description: updateExperienceDto.description,
      price: updateExperienceDto.price,
      images: updatedImages,
      files: updatedPdfs,
    };

    return await this.experienceRepository.update(id, experienceData);
  }

  async remove(id: string, proposalId: string) {
    const experience = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get(
      'S3_EXPERIENCE_IMAGES_FOLDER_PATH',
    );
    const pdfsFolder = this.envService.get('S3_EXPERIENCE_PDFS_FOLDER_PATH');

    await Promise.all(
      experience.images.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, imagesFolder);
        return this.awsService.delete(fileName, imagesFolder);
      }),
    );

    await Promise.all(
      experience.files.map((pdfUrl) => {
        const fileName = extractFileName(pdfUrl, pdfsFolder);
        return this.awsService.delete(fileName, pdfsFolder);
      }),
    );

    return await this.experienceRepository.remove(id);
  }
}
