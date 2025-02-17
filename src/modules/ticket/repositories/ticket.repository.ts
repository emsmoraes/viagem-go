import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        name: data.name,
        type: data.type as any,
        proposalId: data.proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.ticket.findMany({
      where: { proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.ticket.findFirst({
      where: { 
        id,
        proposalId 
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, proposalId: string, data: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type as any,
      },
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string, proposalId: string) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
} 