import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccommodationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AccommodationCreateInput) {
    return this.prisma.accommodation.create({
      data,
      include: {
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.accommodation.findMany({
      where: { proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.accommodation.findFirst({
      where: {
        id,
        proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, data: Prisma.AccommodationUpdateInput) {
    return this.prisma.accommodation.update({
      where: { id },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.accommodation.delete({
      where: { id },
    });
  }
} 