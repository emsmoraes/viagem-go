import { Injectable } from '@nestjs/common';
import { UserKeyRepository } from './repositories/key.repository';

@Injectable()
export class KeyService {
  constructor(private readonly userKeyRepository: UserKeyRepository) {}

  findOne(id: string) {
    return this.userKeyRepository.findByKey(id);
  }
}
