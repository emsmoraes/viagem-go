import { Module } from '@nestjs/common';
import { ProposalCustomerRepository } from './repositories/proposal-customer.repository';
import { ProposalCustomerService } from './proposal-customer.service';
import { ProposalCustomerController } from './proposal-customer.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [ProposalCustomerController],
  providers: [
    ProposalCustomerService,
    ProposalCustomerRepository,
    PrismaService,
  ],
})
export class ProposalCustomerModule {} 