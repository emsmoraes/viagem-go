import { PartialType } from '@nestjs/swagger';
import { CreateAgencyDto } from './create-user-agency.dto';

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {}