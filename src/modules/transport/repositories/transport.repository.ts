import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TransportCreateInput) {
    return this.prisma.transport.create({
      data,
      include: {
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.transport.findMany({
      where: { proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.transport.findFirst({
      where: {
        id,
        proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, data: Prisma.TransportUpdateInput) {
    return this.prisma.transport.update({
      where: { id },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.transport.delete({
      where: { id },
    });
  }
}