import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserRegisterRepository } from '../user-register/repositories/user-register.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService, UserRegisterRepository, PrismaService],
})
export class UserProfileModule {}
