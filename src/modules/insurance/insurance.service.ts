import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsuranceRepository } from './repositories/insurance.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class InsuranceService {
  constructor(
    private readonly insuranceRepository: InsuranceRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createInsuranceDto: CreateInsuranceDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createInsuranceDto.proposalId },
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
            this.envService.get('S3_INSURANCE_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_INSURANCE_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const insuranceData: Prisma.InsuranceCreateInput = {
      title: createInsuranceDto.title,
      description: createInsuranceDto.description,
      price: createInsuranceDto.price,
      proposal: {
        connect: { id: createInsuranceDto.proposalId },
      },
      images: imageUrls,
      files: pdfUrls,
    };

    return await this.insuranceRepository.create(insuranceData);
  }

  async findAll(proposalId: string) {
    return await this.insuranceRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const insurance = await this.insuranceRepository.findOne(id, proposalId);

    if (!insurance) {
      throw new NotFoundException('Seguro não encontrado');
    }

    return insurance;
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
        folder: this.envService.get('S3_INSURANCE_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por seguro',
      },
      pdf: {
        folder: this.envService.get('S3_INSURANCE_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por seguro',
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
    updateInsuranceDto: UpdateInsuranceDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const insurance = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      insurance.images,
      updateInsuranceDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      insurance.files,
      updateInsuranceDto.fileUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const insuranceData: Prisma.InsuranceUpdateInput = {
      title: updateInsuranceDto.title,
      description: updateInsuranceDto.description,
      price: updateInsuranceDto.price,
      images: updatedImages,
      files: updatedPdfs,
    };

    return await this.insuranceRepository.update(id, insuranceData);
  }

  async remove(id: string, proposalId: string) {
    const insurance = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_INSURANCE_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_INSURANCE_PDFS_FOLDER_PATH');

    await Promise.all(
      insurance.images.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, imagesFolder);
        return this.awsService.delete(fileName, imagesFolder);
      }),
    );

    await Promise.all(
      insurance.files.map((pdfUrl) => {
        const fileName = extractFileName(pdfUrl, pdfsFolder);
        return this.awsService.delete(fileName, pdfsFolder);
      }),
    );

    return await this.insuranceRepository.remove(id);
  }
}