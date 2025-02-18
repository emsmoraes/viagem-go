import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateSegmentDto } from '../dto/create-segment.dto';
import { UpdateSegmentDto } from '../dto/update-segment.dto';

@Injectable()
export class SegmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSegmentDto) {
    return this.prisma.segment.create({
      data: {
        origin: data.origin,
        destination: data.destination,
        departure: data.departure ? new Date(data.departure) : null,
        arrival: data.arrival ? new Date(data.arrival) : null,
        flightNumber: data.flightNumber,
        airline: data.airline,
        class: data.class,
        duration: data.duration,
        ticketId: data.ticketId,
      },
      include: {
        ticket: true,
      },
    });
  }

  async findAll(ticketId: string) {
    return this.prisma.segment.findMany({
      where: { ticketId },
      include: {
        ticket: true,
      },
    });
  }

  async findOne(id: string, ticketId: string) {
    return this.prisma.segment.findFirst({
      where: { 
        id,
        ticketId 
      },
      include: {
        ticket: true,
      },
    });
  }

  async update(id: string, ticketId: string, data: UpdateSegmentDto) {
    return this.prisma.segment.update({
      where: { id },
      data: {
        origin: data.origin,
        destination: data.destination,
        departure: data.departure ? new Date(data.departure) : undefined,
        arrival: data.arrival ? new Date(data.arrival) : undefined,
        flightNumber: data.flightNumber,
        airline: data.airline,
        class: data.class,
        duration: data.duration,
      },
      include: {
        ticket: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.segment.delete({
      where: { id },
    });
  }
} 