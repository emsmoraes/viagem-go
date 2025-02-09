
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UserRegisterModule } from '../user-register/user-register.module';
import { UserRegisterRepository } from '../user-register/repositories/user-register.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  imports: [
    UserRegisterModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, UserRegisterRepository, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
