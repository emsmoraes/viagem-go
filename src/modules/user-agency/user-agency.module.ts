import { Module } from '@nestjs/common';
import { AgencyService } from './user-agency.service';
import { AgencyController } from './user-agency.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AgencyRepository } from './repositories/user-agency.repository';

@Module({
  controllers: [AgencyController],
  providers: [AgencyService, AgencyRepository, PrismaService],
})
export class AgencyModule {}
