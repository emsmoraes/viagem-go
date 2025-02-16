import { Injectable } from '@nestjs/common';
import { CreateProposalCustomerDto } from '../dto/create-proposal-customer.dto';
import { RemoveProposalCustomerDto } from '../dto/remove-proposal-customer.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ProposalCustomerRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProposalCustomerDto) {
    const { relations } = data;
    
    // Processa todas as relações em paralelo
    const promises = relations.map(({ proposalId, customerId }) =>
      this.prisma.proposal.update({
        where: { id: proposalId },
        data: {
          customers: {
            connect: { id: customerId },
          },
        },
        include: {
          customers: true,
        },
      })
    );

    return Promise.all(promises);
  }

  async remove(data: RemoveProposalCustomerDto) {
    const { relations } = data;

    // Processa todas as remoções em paralelo
    const promises = relations.map(({ proposalId, customerId }) =>
      this.prisma.proposal.update({
        where: { id: proposalId },
        data: {
          customers: {
            disconnect: { id: customerId },
          },
        },
      })
    );

    return Promise.all(promises);
  }
}
