import { Injectable, NotFoundException } from '@nestjs/common';
import { UserKeyRepository } from './repositories/key.repository';

@Injectable()
export class KeyService {
  constructor(private readonly userKeyRepository: UserKeyRepository) {}

  async findOne(id: string) {
    const userKey = await this.userKeyRepository.findByKey(id);

    if (!userKey) {
      throw new NotFoundException('Chave não encontrada');
    }

    if (userKey.expiresAt < new Date()) {
      throw new NotFoundException('Chave expirada');
    }

    return userKey;
  }
}
