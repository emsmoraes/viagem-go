import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('passengers')
@UseGuards(AuthGuard)
@Controller('passengers')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo passageiro' })
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.create(createPassengerDto);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os passageiros de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.passengerService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um passageiro específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.passengerService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um passageiro' })
  update(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
    @Body() updatePassengerDto: UpdatePassengerDto
  ) {
    return this.passengerService.update(id, proposalId, updatePassengerDto);
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um passageiro' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.passengerService.remove(id, proposalId);
  }
} 