import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SummaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SummaryCreateInput) {
    return this.prisma.summary.create({
      data,
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.summary.findMany({
      where: { proposalId },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.summary.findUnique({
      where: { id, proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async update(
    id: string,
    proposalId: string,
    data: Prisma.SummaryUpdateInput,
  ) {
    return this.prisma.summary.update({
      where: { id, proposalId },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string, proposalId: string) {
    return this.prisma.summary.delete({
      where: { id, proposalId },
    });
  }
}
