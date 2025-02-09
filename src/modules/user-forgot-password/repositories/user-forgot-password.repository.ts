import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class UserForgotPasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async UpdateUserPassword(userId: string, newPassword: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}
