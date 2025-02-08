import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class UserKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByKey(key: string) {
    const findKey = await this.prisma.userKey.findFirst({
      where: {
        key: key,
      },
      include: {
        user: true
      }
    });

    if (!findKey) {
      throw new NotFoundException('Key não encontrada');
    }

    return findKey;
  }
}
