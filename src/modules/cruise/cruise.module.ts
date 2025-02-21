import { Module } from '@nestjs/common';
import { CruiseService } from './cruise.service';
import { CruiseController } from './cruise.controller';
import { CruiseRepository } from './repositories/cruise.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [CruiseController],
  providers: [
    CruiseService,
    CruiseRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class CruiseModule {} 