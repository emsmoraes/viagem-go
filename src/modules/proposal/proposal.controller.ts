import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.proposalService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.proposalService.update(id, updateProposalDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.remove(id, userId);
  }
}
