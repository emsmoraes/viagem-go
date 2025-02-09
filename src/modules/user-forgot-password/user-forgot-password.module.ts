import { Module } from '@nestjs/common';
import { UserForgotPasswordService } from './user-forgot-password.service';
import { UserForgotPasswordController } from './user-forgot-password.controller';
import { UserForgotPasswordRepository } from './repositories/user-forgot-password.repository';
import { UserKeyRepository } from '../key/repositories/key.repository';
import { UserRegisterRepository } from '../user-register/repositories/user-register.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [UserForgotPasswordController],
  providers: [UserForgotPasswordService, UserForgotPasswordRepository, UserKeyRepository, UserRegisterRepository, PrismaService],
})
export class UserForgotPasswordModule {}
