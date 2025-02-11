import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class UserAvatarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateUserAvatar({
    userId,
    avatarUrl,
  }: {
    userId: string;
    avatarUrl: string;
  }) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
    });
  }

  async deleteAvatar(userId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: null,
      },
    });
  }
}
