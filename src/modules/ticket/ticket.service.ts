import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketRepository } from './repositories/ticket.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: createTicketDto.proposalId },
    });

    if (!proposal) {
      throw new BadRequestException('Proposta não encontrada');
    }

    return await this.ticketRepository.create(createTicketDto);
  }

  async findAll(proposalId: string) {
    return await this.ticketRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const ticket = await this.ticketRepository.findOne(id, proposalId);
    
    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }

    return ticket;
  }

  async update(id: string, proposalId: string, updateTicketDto: UpdateTicketDto) {
    await this.findOne(id, proposalId);
    return await this.ticketRepository.update(id, proposalId, updateTicketDto);
  }

  async remove(id: string, proposalId: string) {
    await this.findOne(id, proposalId);
    return await this.ticketRepository.remove(id, proposalId);
  }
} 