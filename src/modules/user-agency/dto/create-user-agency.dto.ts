import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class CreateAgencyDto {
  @ApiProperty({ example: 'Agência de Viagens XYZ', description: 'Nome da agência' })
  @IsString()
  name: string;

  @ApiProperty({ example: '5511999999999', description: 'WhatsApp da agência', required: false })
  @IsOptional()
  @IsPhoneNumber('BR')
  whatsapp?: string;

  @ApiProperty({ example: '1122223333', description: 'Telefone da agência', required: false })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty({ example: 'https://www.agenciaxyz.com.br', description: 'Site da agência', required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  website?: string;

  @ApiProperty({ example: '@agenciaxyz', description: 'Instagram da agência', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ example: 'https://goo.gl/maps/abc123def456', description: 'Link para localização da agência', required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  locationLink?: string;

  @ApiProperty({ example: 'Agência especializada em viagens personalizadas...', description: 'Descrição da agência', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do usuário' })
  @IsString()
  userId: string;
}