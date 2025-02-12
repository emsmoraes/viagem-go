import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserForgotPasswordDto } from './dto/create-user-forgot-password.dto';
import { UpdateUserForgotPasswordDto } from './dto/update-user-forgot-password.dto';
import { UserForgotPasswordRepository } from './repositories/user-forgot-password.repository';
import { UserKeyRepository } from '../key/repositories/key.repository';
import { UserRegisterRepository } from '../user-register/repositories/user-register.repository';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserForgotPasswordService {
  constructor(
    private readonly userForgotPasswordRepository: UserForgotPasswordRepository,
    private readonly userKeyRepository: UserKeyRepository,
    private readonly userRegisterRepository: UserRegisterRepository,
    private readonly mailerService: MailerService,
  ) {}

  async create(data: CreateUserForgotPasswordDto) {
    try {
      const user = await this.userRegisterRepository.findByEmail(data.email);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const key = await this.userKeyRepository.create({
        type: 'forgot_password',
        userId: user.id,
      });

      const link = `${data.redirectUrl.replace(/\/$/, '')}/${key.key}`;

      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Forgot Your password!',
        template: 'forgot_password',
        context: { redirectUrl: `${link}` },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async update(keyParam: string, data: UpdateUserForgotPasswordDto) {
    try {
      const key = await this.userKeyRepository.findByKey(keyParam);

      if (!key) {
        throw new NotFoundException('Key not found');
      }

      const hashedPassword = data.password
        ? await bcrypt.hash(data.password, 10)
        : null;

      await this.userForgotPasswordRepository.UpdateUserPassword(
        key.userId,
        hashedPassword,
      );

      await this.userKeyRepository.deleteKeyByKey(key.key);
    } catch (e) {
      console.log(e);
    }
  }
}
