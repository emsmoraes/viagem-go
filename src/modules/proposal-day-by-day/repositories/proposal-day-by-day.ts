import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ProposalDayByDayRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.proposalDayByDay.findMany();
  }

  async create(data: Prisma.ProposalDayByDayCreateInput) {
    return await this.prisma.proposalDayByDay.create({ data });
  }

  async findOne(id: string, userId: string) {
    const proposalDayByDay = await this.prisma.proposalDayByDay.findUnique({
      where: { id },
      include: { proposal: true },
    });

    if (!proposalDayByDay) {
      throw new NotFoundException('Day by day não encontrado');
    }

    if (proposalDayByDay.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este day by day',
      );
    }

    return proposalDayByDay;
  }

  async updateCoverUrls(id: string, images: string[]) {
    return await this.prisma.proposalDayByDay.update({
      where: { id },
      data: { images },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Prisma.ProposalDayByDayUpdateInput,
  ) {
    const proposalDayByDay = await this.prisma.proposalDayByDay.findUnique({
      where: { id },
      include: { proposal: true },
    });

    if (!proposalDayByDay) {
      throw new NotFoundException('Day by day não encontrado');
    }

    if (proposalDayByDay.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este day by day',
      );
    }

    return await this.prisma.proposalDayByDay.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string, userId: string) {
    const proposalDayByDay = await this.prisma.proposalDayByDay.findUnique({
      where: { id },
      include: { proposal: true },
    });

    if (!proposalDayByDay) {
      throw new NotFoundException('Day by day não encontrado');
    }

    if (proposalDayByDay.proposal.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este day by day',
      );
    }

    return await this.prisma.proposalDayByDay.delete({
      where: { id },
    });
  }
}
