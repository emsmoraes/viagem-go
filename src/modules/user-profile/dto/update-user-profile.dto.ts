import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'securePassword123', required: false })
  @IsOptional()
  @IsString()
  @Length(6, 50)
  password?: string;

  @ApiProperty({ example: '+5511999999999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Obrigado pela sua proposta!', required: false })
  @IsOptional()
  @IsString()
  proposalThankYouMessageTitle?: string;

  @ApiProperty({ example: 'Entraremos em contato em breve.', required: false })
  @IsOptional()
  @IsString()
  proposalThankYouMessageSubtitle?: string;
}
