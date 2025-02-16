import { Controller, Post, Delete, Body } from '@nestjs/common';
import { ProposalCustomerService } from './proposal-customer.service';
import { CreateProposalCustomerDto } from './dto/create-proposal-customer.dto';
import { RemoveProposalCustomerDto } from './dto/remove-proposal-customer.dto';

@Controller('proposal-customer')
export class ProposalCustomerController {
  constructor(private proposalCustomerService: ProposalCustomerService) {}

  @Post()
  create(@Body() createProposalCustomerDto: CreateProposalCustomerDto) {
    return this.proposalCustomerService.create(createProposalCustomerDto);
  }

  @Delete()
  remove(@Body() removeProposalCustomerDto: RemoveProposalCustomerDto) {
    return this.proposalCustomerService.remove(removeProposalCustomerDto);
  }
}
