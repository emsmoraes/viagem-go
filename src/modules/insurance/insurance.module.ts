import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { InsuranceRepository } from './repositories/insurance.repository';

@Module({
  controllers: [InsuranceController],
  providers: [
    InsuranceService,
    InsuranceRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class InsuranceModule {}
