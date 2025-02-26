import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { ExtraController } from './extra.controller';
import { ExtraService } from './extra.service';
import { ExtraRepository } from './repositories/extra.repository';

@Module({
  controllers: [ExtraController],
  providers: [
    ExtraService,
    ExtraRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class ExtraModule {}
