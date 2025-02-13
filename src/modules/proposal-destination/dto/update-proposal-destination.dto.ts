import { PartialType } from '@nestjs/swagger';
import { CreateProposalDestinationDto } from './create-proposal-destination.dto';

export class UpdateProposalDestinationDto extends PartialType(CreateProposalDestinationDto) {}
