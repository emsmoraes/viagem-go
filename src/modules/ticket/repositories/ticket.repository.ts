import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TicketCreateInput) {
    return this.prisma.ticket.create({
      data,
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
        proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, data: Prisma.TicketUpdateInput) {
    return this.prisma.ticket.update({
      where: { id },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
