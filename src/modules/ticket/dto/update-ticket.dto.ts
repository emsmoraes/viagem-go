import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
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
    description: 'Lista de URLs dos PDFs que devem ser mantidos',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pdfUrls?: string[];
} 