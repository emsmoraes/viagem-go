import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ExperienceCreateInput) {
    return this.prisma.experience.create({
      data,
      include: {
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.experience.findMany({
      where: { proposalId },
      include: {
        proposal: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.experience.findFirst({
      where: {
        id,
        proposalId,
      },
      include: {
        proposal: true,
      },
    });
  }

  async update(id: string, data: Prisma.ExperienceUpdateInput) {
    return this.prisma.experience.update({
      where: { id },
      data,
      include: {
        proposal: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}