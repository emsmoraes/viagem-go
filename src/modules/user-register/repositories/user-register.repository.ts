import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRegisterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const validUserData: Prisma.UserCreateInput = {
        email: data.email,
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
    const user = await this.prisma.user.findFirst({
      where: {
        email: userEmail,
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
}
