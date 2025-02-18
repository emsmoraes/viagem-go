import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SegmentService } from './segment.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('segments')
@UseGuards(AuthGuard)
@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo trecho' })
  create(@Body() createSegmentDto: CreateSegmentDto) {
    return this.segmentService.create(createSegmentDto);
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Listar todos os trechos de um ticket' })
  findAll(@Param('ticketId') ticketId: string) {
    return this.segmentService.findAll(ticketId);
  }

  @Get(':id/ticket/:ticketId')
  @ApiOperation({ summary: 'Buscar um trecho específico' })
  findOne(@Param('id') id: string, @Param('ticketId') ticketId: string) {
    return this.segmentService.findOne(id, ticketId);
  }

  @Patch(':id/ticket/:ticketId')
  @ApiOperation({ summary: 'Atualizar um trecho' })
  update(
    @Param('id') id: string,
    @Param('ticketId') ticketId: string,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ) {
    return this.segmentService.update(id, ticketId, updateSegmentDto);
  }

  @Delete(':id/ticket/:ticketId')
  @ApiOperation({ summary: 'Remover um trecho' })
  remove(@Param('id') id: string, @Param('ticketId') ticketId: string) {
    return this.segmentService.remove(id, ticketId);
  }
} 