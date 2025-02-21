import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CruiseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CruiseCreateInput) {
    return this.prisma.cruise.create({ data });
  }

  async findAll(proposalId: string) {
    return this.prisma.cruise.findMany({ where: { proposalId } });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.cruise.findFirst({ where: { id, proposalId } });
  }

  async update(id: string, data: Prisma.CruiseUpdateInput) {
    return this.prisma.cruise.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.cruise.delete({ where: { id } });
  }
}