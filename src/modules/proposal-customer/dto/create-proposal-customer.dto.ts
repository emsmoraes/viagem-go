import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ProposalCustomerRelation {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'O ID da proposta é obrigatório' })
  @IsUUID('4', { message: 'O ID da proposta deve ser um UUID válido' })
  proposalId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  @IsUUID('4', { message: 'O ID do cliente deve ser um UUID válido' })
  customerId: string;
}

export class CreateProposalCustomerDto {
  @ApiProperty({
    type: [ProposalCustomerRelation],
    description: 'Array de relações entre propostas e clientes',
  })
  @IsArray({ message: 'As relações devem ser fornecidas em um array' })
  @ArrayMinSize(1, { message: 'Pelo menos uma relação deve ser fornecida' })
  @ValidateNested({ each: true })
  @Type(() => ProposalCustomerRelation)
  relations: ProposalCustomerRelation[];
} 