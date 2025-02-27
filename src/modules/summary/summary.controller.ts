import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('summaries')
@UseGuards(AuthGuard)
@Controller('summaries')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo resumo' })
  create(@Body() createSummaryDto: CreateSummaryDto) {
    return this.summaryService.create(createSummaryDto);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os extras de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.summaryService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar resumo de uma proposta' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.summaryService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar resumo de uma proposta' })
  update(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
    @Body() updateSummaryDto: UpdateSummaryDto,
  ) {
    return this.summaryService.update(id, proposalId, updateSummaryDto);
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover resumo de uma proposta' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.summaryService.remove(id, proposalId);
  }
}
