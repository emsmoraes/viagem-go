import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegisterRepository } from './repositories/user-register.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { validateOrReject } from 'class-validator';
import { MailerService } from '@nestjs-modules/mailer';
import { UserKeyRepository } from '../key/repositories/key.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AgencyRepository } from '../user-agency/repositories/user-agency.repository';
import { UserType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegisterRepository: UserRegisterRepository,
    private readonly userKeyRepository: UserKeyRepository,
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    private readonly agencyRepository: AgencyRepository,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const validAgency = data.agencyId
        ? await this.agencyRepository.findById(data.agencyId)
        : null;

      const userData = {
        email: data.email,
        type: validAgency ? UserType.AGENCY_EMPLOYEE : UserType.AGENCY_ADMIN,
      };

      const createdUser = await this.userRegisterRepository.create(
        userData,
        validAgency ? data.agencyId : null,
      );

      const createdUserKey = await this.userKeyRepository.create({
        type: 'account_creation',
        userId: createdUser.id,
      });

      const link = `${data.redirectUrl.replace(/\/$/, '')}/${createdUserKey.key}`;

      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Welcome to our platform!',
        template: 'welcome',
        context: { redirectUrl: link },
      });

      if (!validAgency) {
        const createdAgency = await this.agencyRepository.create({
          name: `${createdUser.email} agency`,
        });
        await this.prisma.user.update({
          where: { id: createdUser.id },
          data: { agencyId: createdAgency.id },
        });
      }

      return createdUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(key: string, data: UpdateUserDto) {
    try {
      this.userRegisterRepository.UpdateByKey(key, data);
    } catch (e) {
      console.log(e);
    }
  }

  async delete(userId: string) {
    try {
      const user = await this.userRegisterRepository.findById(userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.agencyId && user.type === 'AGENCY_ADMIN') {
        await this.agencyRepository.delete(user.agencyId);
      }

      await this.userRegisterRepository.deleteById(userId);

      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting user');
    }
  }
}
