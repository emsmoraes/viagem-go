import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ProposalDestinationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.proposalDestination.findMany();
  }

  async create(data: Prisma.ProposalDestinationCreateInput) {
    return await this.prisma.proposalDestination.create({ data });
  }

  async updateCoverUrl(id: string, coverUrl: string) {
    return await this.prisma.proposalDestination.update({
      where: { id },
      data: { coverUrl },
    });
  }
}
