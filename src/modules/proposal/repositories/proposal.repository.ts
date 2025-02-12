import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UpdateProposalDto } from '../dto/update-proposal.dto';

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

  async update({
    userId,
    proposalId,
    data,
    proposalCoverUrl
  }: {
    userId: string;
    proposalId: string;
    data: UpdateProposalDto;
    proposalCoverUrl?: string;
  }) {
    const updateData: any = {
      ...data,
    };
  
    if (proposalCoverUrl) {
      updateData.coverUrl = proposalCoverUrl;
    }
  
    return await this.prisma.proposal.update({
      where: {
        id: proposalId,
        userId: userId,
      },
      data: updateData,
    });
  }

  async delete({ userId, proposalId }: { userId: string; proposalId: string }) {
    return await this.prisma.proposal.delete({
      where: {
        id: proposalId,
        userId: userId,
      },
    });
  }
}
