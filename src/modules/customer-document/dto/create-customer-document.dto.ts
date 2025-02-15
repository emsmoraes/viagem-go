import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateCustomerDocumentDto {
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

  @ApiProperty({
    example: 'customer-uuid',
    description: 'ID of the customer associated with this document',
  })
  @IsString()
  customerId: string;
}
