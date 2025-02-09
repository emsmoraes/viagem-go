import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { validateOrReject } from 'class-validator';
import { handleErrors } from 'src/shared/helpers/validation-error.helper';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UpdateUserProfileDto } from 'src/modules/user-profile/dto/update-user-profile.dto';

@Injectable()
export class UserRegisterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const userData = new CreateUserDto();

    try {
      Object.assign(userData, data);
      await validateOrReject(userData);

      const validUserData: Prisma.UserCreateInput = {
        email: userData.email,
      };

      const createdUser = await this.prisma.user.create({
        data: validUserData,
      });

      await this.prisma.userKey.create({
        data: {
          key: randomUUID(),
          userId: createdUser.id,
          type: 'account_creation',
        },
      });

      return createdUser;
    } catch (e) {
      handleErrors(e);
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

  async UpdateById(id: string, data: UpdateUserProfileDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userData = new UpdateUserProfileDto();

    try {
      Object.assign(userData, data);
      await validateOrReject(userData);

      await this.prisma.user.update({
        where: { id: id },
        data: userData,
      });
    } catch (e) {
      handleErrors(e);
    }
  }

  async UpdateByKey(key: string, data: UpdateUserDto) {
    const userKey = await this.prisma.userKey.findUnique({
      where: {
        key: key,
      },
      include: {
        user: true,
      },
    });

    if (!userKey) {
      throw new NotFoundException('Key não encontrada');
    }

    const userData = new UpdateUserDto();

    try {
      Object.assign(userData, data);
      await validateOrReject(userData);

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
      handleErrors(e);
    }
  }
}
