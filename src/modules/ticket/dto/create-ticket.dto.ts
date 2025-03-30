import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum TicketType {
  OUTBOUND,
  INBOUND,
  INTERNAL,
}

export class CreateTicketDto {
  @ApiProperty({
    example: 'São Paulo',
    description: 'Origem do ticket (exemplo: cidade de partida)',
  })
  @IsString()
  origin: string;

  @ApiProperty({
    example: 'Paris',
    description: 'Destino do ticket (exemplo: cidade de chegada)',
  })
  @IsString()
  destination: string;

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
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  baggagePerPerson?: number;

  @ApiProperty({
    example: '3h 30m',
    description: 'Duração total em formato de string (exemplo: "3h 30m")',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    description: 'Data e hora de embarque (ISO 8601)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  departureAt?: string;

  @ApiProperty({
    example: '2024-12-01T15:30:00Z',
    description: 'Data e hora de chegada (ISO 8601)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  arrivalAt?: string;

  @ApiProperty({
    example: 1500.5,
    description: 'Valor do ticket',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
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

  @ApiProperty({
    example: [
      'https://viagem-go.s3.sa-east-1.amazonaws.com/tickets/pdf/123-abc.pdf',
    ],
    required: false,
    description: 'Lista de URLs dos PDFs que devem ser mantidas',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pdfUrls?: string[];

  @ApiProperty({
    example: 'Observações sobre o voo...',
    description: 'Observação adicional sobre o ticket',
    required: false,
  })
  @IsOptional()
  @IsString()
  observation?: string;
}
