import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../validators/match.decorator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @Length(6, 50)
  password: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @Match('password', { message: 'Password confirmation does not match' })
  passwordConfirm: string;
}
