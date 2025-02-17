import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PassengerRepository } from './repositories/passenger.repository';

@Injectable()
export class PassengerService {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async create(createPassengerDto: CreatePassengerDto) {
    return await this.passengerRepository.create(createPassengerDto);
  }

  async findAll(proposalId: string) {
    return await this.passengerRepository.findAll(proposalId);
  }

  async findOne(id: string, proposalId: string) {
    const passenger = await this.passengerRepository.findOne(id, proposalId);
    
    if (!passenger) {
      throw new NotFoundException('Passageiro não encontrado');
    }

    return passenger;
  }

  async update(id: string, proposalId: string, updatePassengerDto: UpdatePassengerDto) {
    await this.findOne(id, proposalId);
    return await this.passengerRepository.update(id, proposalId, updatePassengerDto);
  }

  async remove(id: string, proposalId: string) {
    await this.findOne(id, proposalId);
    return await this.passengerRepository.remove(id, proposalId);
  }
} 