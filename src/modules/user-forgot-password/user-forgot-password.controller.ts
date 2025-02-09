import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UserForgotPasswordService } from './user-forgot-password.service';
import { CreateUserForgotPasswordDto } from './dto/create-user-forgot-password.dto';
import { UpdateUserForgotPasswordDto } from './dto/update-user-forgot-password.dto';

@Controller('forgot-password')
export class UserForgotPasswordController {
  constructor(
    private readonly userForgotPasswordService: UserForgotPasswordService,
  ) {}

  @Post()
  create(@Body() createUserForgotPasswordDto: CreateUserForgotPasswordDto) {
    return this.userForgotPasswordService.create(createUserForgotPasswordDto);
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateUserForgotPasswordDto: UpdateUserForgotPasswordDto,
  ) {
    return this.userForgotPasswordService.update(
      key,
      updateUserForgotPasswordDto,
    );
  }
}
