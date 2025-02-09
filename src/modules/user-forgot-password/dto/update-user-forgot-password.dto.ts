import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Match } from 'src/modules/user-register/validators/match.decorator';

export class UpdateUserForgotPasswordDto {
  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @Length(6, 50)
  password: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @Match('password', { message: 'Password confirmation does not match' })
  passwordConfirm: string;
}
