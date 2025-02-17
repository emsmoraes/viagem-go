import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class UserKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ type, userId }: { type: string; userId: string }) {
    return await this.prisma.userKey.create({
      data: {
        key: randomUUID(),
        userId: userId,
        type: type,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
  }

  async findByKey(key: string) {
    const findKey = await this.prisma.userKey.findFirst({
      where: {
        key: key,
      },
      include: {
        user: true,
      },
    });

    if (!findKey) {
      throw new NotFoundException('Key não encontrada');
    }

    return findKey;
  }

  async deleteKeyByKey(key: string) {
    await this.prisma.userKey.delete({
      where: {
        key,
      },
    });
  }

  async deleteExpiredKeys() {
    const result = await this.prisma.userKey.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
