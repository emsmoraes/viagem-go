import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketRepository } from './repositories/ticket.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createTicketDto.proposalId },
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
            this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH'),
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
            this.envService.get('S3_TICKET_PDFS_FOLDER_PATH'),
          );
        }),
      );
    }

    const ticketData: Prisma.TicketCreateInput = {
      name: createTicketDto.name,
      type: createTicketDto.type as any,
      proposal: {
        connect: { id: createTicketDto.proposalId },
      },
      baggagePerPerson: createTicketDto.baggagePerPerson,
      duration: createTicketDto.duration,
      price: createTicketDto.price,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      pdfUrls: pdfUrls.length > 0 ? pdfUrls : undefined,
    };

    return await this.ticketRepository.create(ticketData);
  }

  async findAll(proposalId: string) {
    return await this.ticketRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const ticket = await this.ticketRepository.findOne(id, proposalId);

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    return ticket;
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
        folder: this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH'),
        extension: 'webp',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 imagens por ticket',
      },
      pdf: {
        folder: this.envService.get('S3_TICKET_PDFS_FOLDER_PATH'),
        extension: 'pdf',
        maxFiles: 10,
        errorMessage: 'Máximo de 10 PDFs por ticket',
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
    updateTicketDto: UpdateTicketDto,
    imageFiles?: Express.Multer.File[],
    pdfFiles?: Express.Multer.File[],
  ) {
    const ticket = await this.findOne(id, proposalId);

    const updatedImages = await this.processFiles(
      id,
      ticket.imageUrls ?? [],
      updateTicketDto.imageUrls ?? [],
      imageFiles,
      'image',
    );

    const updatedPdfs = await this.processFiles(
      id,
      ticket.pdfUrls ?? [],
      updateTicketDto.pdfUrls ?? [],
      pdfFiles,
      'pdf',
    );

    const ticketData: Prisma.TicketUpdateInput = {
      name: updateTicketDto.name,
      type: updateTicketDto.type as any,
      baggagePerPerson: updateTicketDto.baggagePerPerson,
      duration: updateTicketDto.duration,
      price: updateTicketDto.price,
      imageUrls: updatedImages,
      pdfUrls: updatedPdfs,
    };

    return await this.ticketRepository.update(id, ticketData);
  }

  async remove(id: string, proposalId: string) {
    const ticket = await this.findOne(id, proposalId);
    const imagesFolder = this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH');
    const pdfsFolder = this.envService.get('S3_TICKET_PDFS_FOLDER_PATH');

    if (ticket.imageUrls?.length) {
      await Promise.all(
        ticket.imageUrls.map((imageUrl) => {
          const fileName = extractFileName(imageUrl, imagesFolder);
          return this.awsService.delete(fileName, imagesFolder);
        }),
      );
    }

    if (ticket.pdfUrls?.length) {
      await Promise.all(
        ticket.pdfUrls.map((pdfUrl) => {
          const fileName = extractFileName(pdfUrl, pdfsFolder);
          return this.awsService.delete(fileName, pdfsFolder);
        }),
      );
    }

    return await this.ticketRepository.remove(id);
  }
}
