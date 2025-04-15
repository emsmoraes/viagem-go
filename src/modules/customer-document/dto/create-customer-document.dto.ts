// create-customer-documents.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerDocumentItemDto } from './create-customer-document-item.dto';

export class CreateCustomerDocumentsDto {
  @ApiProperty({
    example: 'customer-uuid',
    description: 'ID of the customer associated with these documents',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    type: [CreateCustomerDocumentItemDto],
    description: 'Array of customer documents',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerDocumentItemDto)
  documents: CreateCustomerDocumentItemDto[];
}
