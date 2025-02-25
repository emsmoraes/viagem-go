import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InsuranceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.InsuranceCreateInput) {
    return this.prisma.insurance.create({
      data,
      include: {
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.insurance.findMany({
      where: { proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.insurance.findFirst({
      where: {
        id,
        proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, data: Prisma.InsuranceUpdateInput) {
    return this.prisma.insurance.update({
      where: { id },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.insurance.delete({
      where: { id },
    });
  }
}