import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({ example: 'Rio de Janeiro', required: true })
  @IsString()
  title: string;
}
