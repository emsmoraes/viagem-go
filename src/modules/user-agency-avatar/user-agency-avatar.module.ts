import { Module } from '@nestjs/common';
import { AgencyLogoService } from './user-agency-avatar.service';
import { AgencyLogoController } from './user-agency-avatar.controller';
import { AwsService } from '../aws/aws.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AgencyLogoRepository } from './repositories/user-agency-avatar.repository';
import { EnvService } from '../env/env.service';
import { AgencyService } from '../user-agency/user-agency.service';
import { AgencyRepository } from '../user-agency/repositories/user-agency.repository';

@Module({
  controllers: [AgencyLogoController],
  providers: [AgencyLogoService, PrismaService, AwsService, AgencyLogoRepository, EnvService, AgencyService, AgencyRepository],
})
export class AgencyLogoModule {}
