import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateSegmentDto {
  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade de origem',
  })
  @IsString()
  origin: string;

  @ApiProperty({
    example: 'Paris',
    description: 'Cidade de destino',
  })
  @IsString()
  destination: string;

  @ApiPropertyOptional({
    example: '2024-03-20T10:00:00Z',
    description: 'Data e hora de partida',
  })
  @IsOptional()
  @IsDateString()
  departure?: string;

  @ApiPropertyOptional({
    example: '2024-03-21T15:30:00Z',
    description: 'Data e hora de chegada',
  })
  @IsOptional()
  @IsDateString()
  arrival?: string;

  @ApiPropertyOptional({
    example: 'AF1234',
    description: 'Número do voo',
  })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiPropertyOptional({
    example: 'Air France',
    description: 'Companhia aérea',
  })
  @IsOptional()
  @IsString()
  airline?: string;

  @ApiPropertyOptional({
    example: 'Executiva',
    description: 'Classe do voo',
  })
  @IsOptional()
  @IsString()
  class?: string;

  @ApiPropertyOptional({
    example: '12h30',
    description: 'Duração do voo',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID do ticket',
  })
  @IsString()
  ticketId: string;
} 