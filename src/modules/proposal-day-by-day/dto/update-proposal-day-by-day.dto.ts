import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProposalDayByDayDto } from './create-proposal-day-by-day.dto';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsArray } from 'class-validator';

export class UpdateProposalDayByDayDto extends PartialType(
  CreateProposalDayByDayDto,
) {
  @ApiProperty({ example: 'Paris, França', required: true })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example:
      'Uma viagem inesquecível para conhecer a Torre Eiffel e a cultura parisiense.',
    required: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-06-15T10:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureDate?: Date;

  @ApiProperty({ example: '2025-06-30T18:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;

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
  existingImages?: string[];
}
