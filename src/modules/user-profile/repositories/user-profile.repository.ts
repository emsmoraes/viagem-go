import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { validateOrReject } from 'class-validator';
import { handleErrors } from 'src/shared/helpers/validation-error.helper';

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

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    delete user.password

    return user;
  }
}
