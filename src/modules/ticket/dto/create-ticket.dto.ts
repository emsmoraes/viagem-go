import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

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
  baggagePerPerson?: number;

  @ApiProperty({
    example: 180,
    description: 'Duração total em minutos',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiProperty({
    example: 1500.50,
    description: 'Valor do ticket',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
