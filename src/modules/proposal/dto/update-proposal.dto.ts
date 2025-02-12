import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ProposalStatusEnum {
  INCOMPLETE = 'INCOMPLETE',
  AWAITING_RESPONSE = 'AWAITING_RESPONSE',
  CONFIRMED = 'CONFIRMED',
  LOST = 'LOST',
}

export class UpdateProposalDto {
  @ApiProperty({ example: 'Rio de Janeiro', required: true })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'INCOMPLETE',
    enum: ProposalStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProposalStatusEnum)
  status?: ProposalStatusEnum;

  @ApiProperty({ example: '2025-06-15T10:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureDate?: Date;

  @ApiProperty({ example: '2025-06-20T18:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;
}
