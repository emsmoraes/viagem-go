import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExtraDto {
  @ApiProperty({ example: 'Upgrade de quarto', description: 'Título do extra' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Quarto com vista para o mar...', description: 'Descrição do extra', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100.00, description: 'Valor do extra', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiProperty({ example: ['url1', 'url2'], description: 'URLs das imagens' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls: string[];

  @ApiProperty({ example: ['url1', 'url2'], description: 'URLs dos PDFs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fileUrls: string[];

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da proposta' })
  @IsString()
  proposalId: string;
}