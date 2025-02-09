import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserForgotPasswordDto } from './dto/create-user-forgot-password.dto';
import { UpdateUserForgotPasswordDto } from './dto/update-user-forgot-password.dto';
import { handleErrors } from 'src/shared/helpers/validation-error.helper';
import { validateOrReject } from 'class-validator';
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

  async create(createUserForgotPasswordDto: CreateUserForgotPasswordDto) {
    const data = new CreateUserForgotPasswordDto();

    try {
      Object.assign(data, createUserForgotPasswordDto);
      await validateOrReject(data);

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
      handleErrors(e);
    }
  }

  async update(
    keyParam: string,
    updateUserForgotPasswordDto: UpdateUserForgotPasswordDto,
  ) {
    const data = new UpdateUserForgotPasswordDto();

    try {
      Object.assign(data, updateUserForgotPasswordDto);
      await validateOrReject(data);

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
      handleErrors(e);
    }
  }
}
