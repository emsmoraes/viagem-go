import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalCustomerRepository } from './repositories/proposal-customer.repository';
import { CreateProposalCustomerDto } from './dto/create-proposal-customer.dto';
import { RemoveProposalCustomerDto } from './dto/remove-proposal-customer.dto';

@Injectable()
export class ProposalCustomerService {
  constructor(private proposalCustomerRepository: ProposalCustomerRepository) {}

  async create(data: CreateProposalCustomerDto) {
    try {
      const results = await this.proposalCustomerRepository.create(data);
      return {
        message: 'Relações criadas com sucesso',
        data: results
      };
    } catch (error) {
      throw new NotFoundException('Uma ou mais propostas ou clientes não foram encontrados');
    }
  }

  async remove(data: RemoveProposalCustomerDto) {
    try {
      const results = await this.proposalCustomerRepository.remove(data);
      return {
        message: 'Relações removidas com sucesso',
        data: results
      };
    } catch (error) {
      throw new NotFoundException('Um ou mais relacionamentos não foram encontrados');
    }
  }
}
