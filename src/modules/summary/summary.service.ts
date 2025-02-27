import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { SummaryRepository } from './repositories/summary.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryRepository: SummaryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createSummaryDto: CreateSummaryDto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createSummaryDto.proposalId },
    });

    if (!proposal) {
      throw new BadRequestException('Proposta não encontrada');
    }

    const summaryData: Prisma.SummaryCreateInput = {
      includedInProposal: createSummaryDto.includedInProposal,
      totalValue: createSummaryDto.totalValue,
      conditionsAndValidity: createSummaryDto.conditionsAndValidity,
      proposal: {
        connect: { id: createSummaryDto.proposalId },
      },
    };

    return await this.summaryRepository.create(summaryData);
  }

  async findAll(proposalId: string) {
    return await this.summaryRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const summary = await this.summaryRepository.findOne(id, proposalId);

    if (!summary) {
      throw new NotFoundException('Resumo não encontrado');
    }

    return summary;
  }

  async update(id: string, proposalId: string, updateSummaryDto: UpdateSummaryDto) {
    const summaryData: Prisma.SummaryUpdateInput = {
      includedInProposal: updateSummaryDto.includedInProposal,
      totalValue: updateSummaryDto.totalValue,
      conditionsAndValidity: updateSummaryDto.conditionsAndValidity,
    };

    return await this.summaryRepository.update(id, proposalId, summaryData);
  }

  async remove(id: string, proposalId: string) {
    return await this.summaryRepository.remove(id, proposalId);
  }
}