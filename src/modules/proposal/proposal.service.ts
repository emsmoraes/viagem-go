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

  async findOne(id: string, userId: string) {
    const proposal = await this.proposalRepository.findOne({
      userId,
      proposalId: id,
    });
    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    return proposal;
  }

  update(id: number, updateProposalDto: UpdateProposalDto) {
    return `This action updates a #${id} proposal`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposal`;
  }
}
