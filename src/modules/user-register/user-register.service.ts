import { Injectable } from '@nestjs/common';
import { UserRegisterRepository } from './repositories/user-register.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { validateOrReject } from 'class-validator';
import { MailerService } from '@nestjs-modules/mailer';
import { UserKeyRepository } from '../key/repositories/key.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegisterRepository: UserRegisterRepository,
    private readonly userKeyRepository: UserKeyRepository,
    private readonly mailerService: MailerService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const createdUser = await this.userRegisterRepository.create(data);
      const createdUserKey = await this.userKeyRepository.create({
        type: 'account_creation',
        userId: createdUser.id,
      });

      const link = `${data.redirectUrl.replace(/\/$/, '')}/${createdUserKey.key}`;

      this.mailerService.sendMail({
        to: data.email,
        subject: 'Welcome to our platform!',
        template: 'welcome',
        context: { redirectUrl: `${link}` },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async update(key: string, data: UpdateUserDto) {
    try {
      this.userRegisterRepository.UpdateByKey(key, data);
    } catch (e) {
      console.log(e);
    }
  }
}
