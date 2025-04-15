import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateCustomerDocumentDto {
  @ApiPropertyOptional({
    example: 'Passport',
    description: 'Name of the document',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '2025-12-31T00:00:00.000Z',
    description: 'Issue date of the document (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    example: '2030-12-31T00:00:00.000Z',
    description: 'Expiration date of the document (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiProperty({
    example: [
      'https://s3.amazonaws.com/bucket/imagens/proposta1.jpg',
      'https://s3.amazonaws.com/bucket/imagens/proposta2.jpg',
    ],
    required: false,
    description: 'Lista de URLs das imagens que devem ser mantidas',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  existingDocumentUrls?: string[];

  @ApiProperty({
    example: 'customer-uuid',
    description: 'ID of the customer associated with this document',
  })
  @IsString()
  customerId: string;
}
