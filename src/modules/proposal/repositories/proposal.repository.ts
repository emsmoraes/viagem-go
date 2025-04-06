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

  async findAll({
    userId,
    search = '',
    page = 1,
    limit = 10,
  }: {
    userId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          title: {
            contains: search,
            mode: 'insensitive' as 'insensitive',
          },
        }
      : {};

    const totalItems = await this.prisma.proposal.count({
      where: {
        userId,
        ...searchCondition,
      },
    });

    const proposals = await this.prisma.proposal.findMany({
      where: {
        userId,
        ...searchCondition,
      },
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      proposals,
      currentPage: page,
      totalPages,
      totalItems,
    };
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
      include: {
        destinations: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        dayByDays: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        passengers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        tickets: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        accommodations: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        cruises: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        transports: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        experiences: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async update({
    userId,
    proposalId,
    data,
    proposalCoverUrl,
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
