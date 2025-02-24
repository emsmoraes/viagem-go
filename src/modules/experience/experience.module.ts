import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { ExperienceRepository } from './repositories/experience.repository';

@Module({
  controllers: [ExperienceController],
  providers: [
    ExperienceService,
    ExperienceRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class ExperienceModule {}
