import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

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
}
