import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { SegmentRepository } from './repositories/segment.repository';

@Injectable()
export class SegmentService {
  constructor(private readonly segmentRepository: SegmentRepository) {}

  async create(createSegmentDto: CreateSegmentDto) {
    return await this.segmentRepository.create(createSegmentDto);
  }

  async findAll(ticketId: string) {
    return await this.segmentRepository.findAll(ticketId);
  }

  async findOne(id: string, ticketId: string) {
    const segment = await this.segmentRepository.findOne(id, ticketId);
    
    if (!segment) {
      throw new NotFoundException('Trecho não encontrado');
    }

    return segment;
  }

  async update(id: string, ticketId: string, updateSegmentDto: UpdateSegmentDto) {
    await this.findOne(id, ticketId);
    return await this.segmentRepository.update(id, ticketId, updateSegmentDto);
  }

  async remove(id: string, ticketId: string) {
    await this.findOne(id, ticketId);
    return await this.segmentRepository.remove(id);
  }
} 