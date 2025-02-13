import { Module } from '@nestjs/common';
import { ProposalDestinationService } from './proposal-destination.service';
import { ProposalDestinationController } from './proposal-destination.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { ProposalDestinationRepository } from './repositories/proposal-destination';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [ProposalDestinationController],
  providers: [
    ProposalDestinationService,
    PrismaService,
    ProposalDestinationRepository,
    AwsService,
    EnvService,
  ],
})
export class ProposalDestinationModule {}
