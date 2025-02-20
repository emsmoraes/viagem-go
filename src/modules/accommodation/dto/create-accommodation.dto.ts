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

export class CreateAccommodationDto {
  @ApiProperty({
    example: 'Hotel Paris',
    description: 'Nome da hospedagem',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Paris, França',
    description: 'Localização da hospedagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'Rue de Rivoli, 75001',
    description: 'Endereço da hospedagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '2024-03-15T14:00:00Z',
    description: 'Data e hora do check-in',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'Data e hora do check-out',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @ApiProperty({
    example: '5 estrelas',
    description: 'Categoria da hospedagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Meia Pensão',
    description: 'Tipo de pensão',
    required: false,
  })
  @IsOptional()
  @IsString()
  boardType?: string;

  @ApiProperty({
    example: 'Suíte Luxo',
    description: 'Tipo de quarto',
    required: false,
  })
  @IsOptional()
  @IsString()
  roomType?: string;

  @ApiProperty({
    example: 'Vista para a Torre Eiffel...',
    description: 'Descrição da hospedagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1500.5,
    description: 'Valor da hospedagem',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da proposta',
  })
  @IsString()
  proposalId: string;

  @ApiProperty({
    example: [
      'https://viagem-go.s3.amazonaws.com/accommodations/123-abc.webp',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({
    example: [
      'https://viagem-go.s3.amazonaws.com/accommodations/pdf/123-abc.pdf',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pdfUrls?: string[];
} 