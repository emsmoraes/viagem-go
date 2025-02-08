import { Module } from '@nestjs/common';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserKeyRepository } from './repositories/key.repository';

@Module({
  controllers: [KeyController],
  providers: [KeyService, PrismaService, UserKeyRepository],
})
export class KeyModule {}
