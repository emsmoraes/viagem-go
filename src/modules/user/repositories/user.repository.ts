import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { validateOrReject } from 'class-validator';
import { handleErrors } from 'src/shared/helpers/validation-error.helper';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const userData = new CreateUserDto();

    try {
      Object.assign(userData, data);
      await validateOrReject(userData);

      const hashedPassword = userData.password
        ? await bcrypt.hash(userData.password, 10)
        : null;

      const validUserData: Prisma.UserCreateInput = {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      };

      return this.prisma.user.create({ data: validUserData });
    } catch (e) {
      handleErrors(e);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
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

  async UpdateById(userId: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userData = new UpdateUserDto();
    Object.assign(userData, data);

    try {
      Object.assign(userData, data);
      await validateOrReject(userData);

      return await this.prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    } catch (e) {
      handleErrors(e);
    }
  }
}
