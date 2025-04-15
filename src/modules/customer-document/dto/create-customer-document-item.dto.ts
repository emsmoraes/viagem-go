// create-customer-document-item.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDocumentItemDto {
  @ApiPropertyOptional({
    example: 'Passport',
    description: 'Name of the document',
  })
  @IsString()
  name: string;

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

  @ApiPropertyOptional({
    description: 'Files associated with the document',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  files?: any[];
}
