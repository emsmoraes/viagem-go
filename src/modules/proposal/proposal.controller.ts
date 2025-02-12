import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProposalDto: CreateProposalDto, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.create(createProposalDto, userId);
  }

  @Get()
  findAll() {
    return this.proposalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProposalDto: UpdateProposalDto) {
    return this.proposalService.update(+id, updateProposalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proposalService.remove(+id);
  }
}
