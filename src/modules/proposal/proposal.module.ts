import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { ProposalRepository } from './repositories/proposal.repository';

@Module({
  controllers: [ProposalController],
  providers: [ProposalService, PrismaService, ProposalRepository],
})
export class ProposalModule {}
