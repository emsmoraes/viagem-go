import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePassengerDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do passageiro' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'ID do cliente associado (opcional)' 
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'ID da proposta' 
  })
  @IsUUID()
  proposalId: string;
} 