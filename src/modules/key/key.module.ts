import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserKeyRepository } from './repositories/key.repository';
import { CleanExpiredKeysJob } from './jobs/clean-expired-keys.job';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [KeyController],
  providers: [KeyService, PrismaService, UserKeyRepository, CleanExpiredKeysJob],
})
export class KeyModule {}
