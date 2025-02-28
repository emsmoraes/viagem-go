import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAgencyDto } from './dto/update-user-agency.dto';
import { AgencyRepository } from './repositories/user-agency.repository';

@Injectable()
export class AgencyService {
  constructor(private readonly agencyRepository: AgencyRepository) {}

  async findByUserId(userId: string) {
    const agency = await this.agencyRepository.findByUserId(userId);

    if (!agency) {
      throw new NotFoundException('Agência não encontrada');
    }

    return agency;
  }

  async update(userId: string, updateAgencyDto: UpdateAgencyDto) {
    const agency = await this.agencyRepository.findByUserId(userId);

    if (!agency) {
      throw new NotFoundException('Agência não encontrada');
    }

    return this.agencyRepository.update(agency.id, updateAgencyDto);
  }
}