import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransportDto {
  @ApiProperty({ example: 'Ônibus Executivo', description: 'Tipo de transporte' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Viagem confortável com ar condicionado...', description: 'Descrição do transporte', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150.00, description: 'Valor do transporte', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiProperty({ example: ['url1', 'url2'], description: 'URLs das imagens' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
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