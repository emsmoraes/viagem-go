import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { UpdatePassengerDto } from '../dto/update-passenger.dto';

@Injectable()
export class PassengerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePassengerDto) {
    return this.prisma.passenger.create({
      data: {
        name: data.name,
        customerId: data.customerId,
        proposalId: data.proposalId,
      },
      include: {
        customer: true,
        proposal: true,
      },
    });
  }

  async findAll(proposalId: string) {
    return this.prisma.passenger.findMany({
      where: { proposalId },
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string, proposalId: string) {
    return this.prisma.passenger.findFirst({
      where: { 
        id,
        proposalId 
      },
      include: {
        customer: true,
      },
    });
  }

  async update(id: string, proposalId: string, data: UpdatePassengerDto) {
    return this.prisma.passenger.update({
      where: { 
        id,
      },
      data: {
        name: data.name,
        customerId: data.customerId,
      },
      include: {
        customer: true,
      },
    });
  }

  async remove(id: string, proposalId: string) {
    return this.prisma.passenger.delete({
      where: { id },
    });
  }
} 