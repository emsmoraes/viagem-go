import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalRepository } from './repositories/proposal.repository';

@Injectable()
export class ProposalService {
  constructor(private readonly proposalRepository: ProposalRepository) {}

  async create(data: CreateProposalDto, userId: string) {
    return this.proposalRepository.create({ title: data.title, userId });
  }

  findAll(userId: string) {
    return this.proposalRepository.findAll({ userId });
  }

  async findOne(proposalId: string, userId: string) {
    const proposal = await this.proposalRepository.findOne({
      userId,
      proposalId: proposalId,
    });
    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    return proposal;
  }

  async update(proposalId: string, updateProposalDto: UpdateProposalDto, userId: string) {
    return await this.proposalRepository.update({
      proposalId: proposalId,
      title: updateProposalDto.title,
      userId,
    });
  }

  async remove(proposalId: string, userId: string) {
    return await this.proposalRepository.delete({ proposalId, userId });
  }
}
