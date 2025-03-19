import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRegisterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userEmail: string, agencyId?: string) {
    try {
      const validUserData: Prisma.UserCreateInput = {
        email: userEmail,
        ...(agencyId && {
          agency: {
            connect: {
              id: agencyId,
            },
          },
        }),
      };

      const createdUser = await this.prisma.user.create({
        data: validUserData,
      });

      return createdUser;
    } catch (e) {
      console.log(e);
    }
  }

  async findByEmail(userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async UpdateByKey(key: string, userData: UpdateUserDto) {
    const userKey = await this.prisma.userKey.findUnique({
      where: {
        key: key,
      },
      include: {
        user: true,
      },
    });

    if (!userKey) {
      throw new BadRequestException('Chave não encontrada');
    }

    try {
      const hashedPassword = userData.password
        ? await bcrypt.hash(userData.password, 10)
        : null;

      const validUserData: Prisma.UserUpdateInput = {
        name: userData.name,
        password: hashedPassword,
      };

      return await this.prisma.$transaction(async (prisma) => {
        const updatedUser = await prisma.user.update({
          where: { id: userKey.user.id },
          data: validUserData,
        });

        await prisma.userKey.delete({ where: { key } });

        return updatedUser;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteById(userId: string) {
    try {
      await this.prisma.userKey.deleteMany({
        where: { userId: userId },
      });

      const deletedUser = await this.prisma.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    } catch (e) {
      console.log(e);
      throw new NotFoundException('Erro ao excluir o usuário');
    }
  }
}
