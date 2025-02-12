import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async UpdateUserById(id: string, data: UpdateUserProfileDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    try {
      await this.prisma.user.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    delete user.password;

    return user;
  }
}
