import { Module } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { AccommodationController } from './accommodation.controller';
import { AccommodationRepository } from './repositories/accommodation.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [AccommodationController],
  providers: [
    AccommodationService,
    AccommodationRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class AccommodationModule {} 