import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserProfileRepository } from './repositories/user-profile.repository';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileRepository, PrismaService],
})
export class UserProfileModule {}
