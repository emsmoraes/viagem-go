import { Module } from '@nestjs/common';
import { UserAvatarService } from './user-avatar.service';
import { UserAvatarController } from './user-avatar.controller';
import { AwsService } from '../aws/aws.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserAvatarRepository } from './repositories/user-avatar.repository';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [UserAvatarController],
  providers: [UserAvatarService, PrismaService, AwsService, UserAvatarRepository, EnvService],
})
export class UserAvatarModule {}
