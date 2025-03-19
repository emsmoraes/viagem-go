import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegisterRepository } from './repositories/user-register.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserKeyRepository } from '../key/repositories/key.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AgencyRepository } from '../user-agency/repositories/user-agency.repository';
import { UserRoles } from '@prisma/client';
import { addDays } from 'date-fns';
import { UserRoleRepository } from '../user-role/repositories/user-role.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegisterRepository: UserRegisterRepository,
    private readonly userKeyRepository: UserKeyRepository,
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    private readonly agencyRepository: AgencyRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const validAgency = data.agencyId
        ? await this.agencyRepository.findById(data.agencyId)
        : null;

      const createdUser = await this.userRegisterRepository.create(
        data.email,
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

      let agencyId = data.agencyId;

      if (!validAgency) {
        const createdAgency = await this.agencyRepository.create({
          name: `${createdUser.email} agency`,
          subscription: {
            create: {
              isTrial: true,
              planType: 'INDIVIDUAL',
              amountTotal: 0,
              currency: 'BRL',
              paymentStatus: 'trialing',
              status: 'active',
              expiresAt: addDays(new Date(), 7),
            },
          },
        });

        agencyId = createdAgency.id;

        await this.prisma.user.update({
          where: { id: createdUser.id },
          data: { agencyId },
        });
      }

      await this.userRoleRepository.assignRole(
        createdUser.id,
        agencyId,
        validAgency ? UserRoles.EMPLOYEE : UserRoles.OWNER,
      );

      return createdUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(key: string, data: UpdateUserDto) {
    try {
      this.userRegisterRepository.UpdateByKey(key, data);
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: string) {
    try {
      const user = await this.userRegisterRepository.findById(userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.userRoleRepository.deleteByUserId(userId);

      const userRoles = await this.userRoleRepository.findByUserId(userId);
      const isOwner = userRoles.some((role) => role.role === UserRoles.OWNER);

      if (isOwner && user.agencyId) {
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
