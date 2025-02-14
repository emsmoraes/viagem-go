import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: string, userId: string) {
    const proposalDestination =
      await this.prisma.proposalDestination.findUnique({
        where: { id },
        include: { proposal: true },
      });

    if (!proposalDestination) {
      throw new NotFoundException('Destino não encontrado');
    }

    if (proposalDestination.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este destino',
      );
    }

    return proposalDestination;
  }

  async updateCoverUrls(id: string, images: string[]) {
    return await this.prisma.proposalDestination.update({
      where: { id },
      data: { images },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Prisma.ProposalDestinationUpdateInput,
  ) {
    const proposalDestination =
      await this.prisma.proposalDestination.findUnique({
        where: { id },
        include: { proposal: true },
      });

    if (!proposalDestination) {
      throw new NotFoundException('Destino não encontrado');
    }

    if (proposalDestination.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este destino',
      );
    }

    return await this.prisma.proposalDestination.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string, userId: string) {
    const proposalDestination =
      await this.prisma.proposalDestination.findUnique({
        where: { id },
        include: { proposal: true },
      });

    if (!proposalDestination) {
      throw new NotFoundException('Destino não encontrado');
    }

    if (proposalDestination.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este destino',
      );
    }

    return await this.prisma.proposalDestination.delete({
      where: { id },
    });
  }
}
