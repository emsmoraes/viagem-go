import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { TransportRepository } from './repositories/transport.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [TransportController],
  providers: [
    TransportService,
    TransportRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class TransportModule {} 