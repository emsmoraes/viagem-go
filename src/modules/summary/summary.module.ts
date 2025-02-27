import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { SummaryRepository } from './repositories/summary.repository';

@Module({
  controllers: [SummaryController],
  providers: [
    SummaryService,
    SummaryRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class SummaryModule {}
