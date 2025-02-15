import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { ProposalDayByDayController } from './proposal-day-by-day.controller';
import { ProposalDayByDayService } from './proposal-day-by-day.service';
import { ProposalDayByDayRepository } from './repositories/proposal-day-by-day';

@Module({
  controllers: [ProposalDayByDayController],
  providers: [
    ProposalDayByDayService,
    PrismaService,
    ProposalDayByDayRepository,
    AwsService,
    EnvService,
  ],
})
export class ProposalDayBayDayModule {}
