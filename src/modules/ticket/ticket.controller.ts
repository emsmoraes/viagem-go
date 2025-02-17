import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('tickets')
@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo ticket' })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os tickets de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.ticketService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um ticket específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.ticketService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um ticket' })
  update(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
    @Body() updateTicketDto: UpdateTicketDto
  ) {
    return this.ticketService.update(id, proposalId, updateTicketDto);
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um ticket' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.ticketService.remove(id, proposalId);
  }
} 