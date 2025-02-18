import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum TicketType {
  OUTBOUND,
  INBOUND,
  INTERNAL,
}

export class CreateTicketDto {
  @ApiProperty({
    example: 'Voo São Paulo - Paris',
    description: 'Nome do ticket',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'OUTBOUND',
    enum: TicketType,
    description: 'Tipo do ticket (OUTBOUND, INBOUND, INTERNAL)',
  })
  @IsEnum(TicketType)
  type: TicketType;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da proposta',
  })
  @IsString()
  proposalId: string;

  @ApiProperty({
    example: 2,
    description: 'Número de bagagens por passageiro',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  baggagePerPerson?: number;

  @ApiProperty({
    example: 180,
    description: 'Duração total em minutos',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  duration?: number;

  @ApiProperty({
    example: 1500.5,
    description: 'Valor do ticket',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  price?: number;

  @ApiProperty({
    example: [
      'https://viagem-go.s3.sa-east-1.amazonaws.com/tickets/123-abc.webp',
      'https://viagem-go.s3.sa-east-1.amazonaws.com/tickets/456-def.webp',
    ],
    required: false,
    description: 'Lista de URLs das imagens que devem ser mantidas',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
