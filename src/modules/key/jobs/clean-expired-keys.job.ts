import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserKeyRepository } from '../repositories/key.repository';

@Injectable()
export class CleanExpiredKeysJob {
  private readonly logger = new Logger(CleanExpiredKeysJob.name);

  constructor(private readonly userKeyRepository: UserKeyRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredKeys() {
    try {
      const deletedCount = await this.userKeyRepository.deleteExpiredKeys();
      this.logger.log(`${deletedCount} chaves expiradas foram removidas`);
    } catch (error) {
      this.logger.error('Erro ao limpar chaves expiradas:', error);
    }
  }
} 