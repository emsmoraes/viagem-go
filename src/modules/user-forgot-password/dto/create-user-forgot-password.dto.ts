import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class CreateUserForgotPasswordDto {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://viagens-go.com' })
  @IsUrl()
  redirectUrl: string;
}
