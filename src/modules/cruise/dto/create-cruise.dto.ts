import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCruiseDto {
  @ApiProperty({ example: 'MSC Seaview', description: 'Nome do cruzeiro' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Suíte Master', description: 'Tipo de cabine', required: false })
  @IsOptional()
  @IsString()
  cabin?: string;

  @ApiProperty({ example: '2024-04-20T15:00:00Z', description: 'Data e hora do check-in', required: false })
  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @ApiProperty({ example: '2024-04-27T10:00:00Z', description: 'Data e hora do check-out', required: false })
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @ApiProperty({ example: 'Mediterrâneo', description: 'Rota do cruzeiro', required: false })
  @IsOptional()
  @IsString()
  route?: string;

  @ApiProperty({ example: 'Cruzeiro luxuoso com diversas atividades...', description: 'Descrição do cruzeiro', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500.00, description: 'Valor do cruzeiro', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiProperty({ example: 'Cartão de crédito, Boleto', description: 'Formas de pagamento', required: false })
  @IsOptional()
  @IsString()
  paymentMethods?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da proposta' })
  @IsString()
  proposalId: string;

  @ApiProperty({ example: ['url1', 'url2'], description: 'URLs das imagens', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({ example: ['url1', 'url2'], description: 'URLs dos PDFs', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];
}