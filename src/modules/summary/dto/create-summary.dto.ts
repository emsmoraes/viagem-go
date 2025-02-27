import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSummaryDto {
  @ApiProperty({ example: 'Hospedagem, voos, traslados', description: 'Detalhes do que está incluso na proposta' })
  @IsString()
  includedInProposal: string;

  @ApiProperty({ example: 5000.00, description: 'Valor total da proposta', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  totalValue?: number;

  @ApiProperty({ example: 'Válido por 30 dias a partir da data de emissão', description: 'Condições e validade da proposta' })
  @IsString()
  @IsOptional()
  conditionsAndValidity?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da proposta' })
  @IsString()
  proposalId: string;
}