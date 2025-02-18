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
    files?: Express.Multer.File[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createTicketDto.proposalId },
    });

    if (!proposal) {
      throw new BadRequestException('Proposta não encontrada');
    }

    let imageUrls: string[] = [];

    if (files?.length) {
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const fileName = `${crypto.randomUUID()}.webp`;
          return this.awsService.post(
            fileName,
            file.buffer,
            this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH'),
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

  async update(
    id: string,
    proposalId: string,
    updateTicketDto: UpdateTicketDto,
    files?: Express.Multer.File[],
  ) {
    const ticket = await this.findOne(id, proposalId);
    const s3Folder = this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH');

    const storedImages = ticket.imageUrls ?? [];
    const updatedImages = updateTicketDto.imageUrls ?? [];

    const imagesToDelete = storedImages.filter(
      (img) => !updatedImages.includes(img),
    );

    await Promise.all(
      imagesToDelete.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, s3Folder);
        return this.awsService.delete(fileName, s3Folder);
      }),
    );

    if (files?.length) {
      const totalImages = updatedImages.length + files.length;
      if (totalImages > 10) {
        throw new BadRequestException('Máximo de 10 imagens por ticket');
      }

      const newImageUrls = await Promise.all(
        files.map(async (file) => {
          const fileName = `${id}-${crypto.randomUUID()}.webp`;
          return this.awsService.post(fileName, file.buffer, s3Folder);
        }),
      );
      updatedImages.push(...newImageUrls);
    }

    const ticketData: Prisma.TicketUpdateInput = {
      name: updateTicketDto.name,
      type: updateTicketDto.type as any,
      baggagePerPerson: updateTicketDto.baggagePerPerson,
      duration: updateTicketDto.duration,
      price: updateTicketDto.price,
      imageUrls: updatedImages.length > 0 ? updatedImages : undefined
    };

    return await this.ticketRepository.update(id, ticketData);
  }

  async remove(id: string, proposalId: string) {
    const ticket = await this.findOne(id, proposalId);
    const s3Folder = this.envService.get('S3_TICKET_IMAGES_FOLDER_PATH');
    
    if (ticket.imageUrls?.length) {
      await Promise.all(
        ticket.imageUrls.map((imageUrl) => {
          const fileName = extractFileName(imageUrl, s3Folder);
          return this.awsService.delete(fileName, s3Folder);
        }),
      );
    }

    return await this.ticketRepository.remove(id);
  }
}
