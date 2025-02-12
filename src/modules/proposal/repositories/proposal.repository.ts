import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ProposalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ title, userId }: { title: string; userId: string }) {
    return await this.prisma.proposal.create({
      data: {
        userId: userId,
        title: title,
      },
    });
  }

  async findAll({ userId }: { userId: string }) {
    return await this.prisma.proposal.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne({
    userId,
    proposalId,
  }: {
    userId: string;
    proposalId: string;
  }) {
    return await this.prisma.proposal.findFirst({
      where: {
        AND: [{ id: proposalId }, { userId: userId }],
      },
    });
  }
}
