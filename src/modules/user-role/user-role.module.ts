import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  controllers: [],
  providers: [UserRoleRepository, PrismaService],
})
export class UserRoleModule {}
