import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ExpireSubscriptionsJob {
  private readonly logger = new Logger(ExpireSubscriptionsJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireSubscriptions() {
    try {
      const now = new Date();

      const expiredSubscriptions = await this.prisma.subscription.findMany({
        where: {
          expiresAt: { lte: now },
          status: 'active',
        },
      });

      if (expiredSubscriptions.length > 0) {
        const updatePromises = expiredSubscriptions.map(
          async (subscription) => {
            await this.prisma.subscription.update({
              where: { id: subscription.id },
              data: { status: 'expired' },
            });

            this.logger.log(`Assinatura ${subscription.id} expirou.`);
          },
        );

        await Promise.all(updatePromises);

        this.logger.log(
          `${expiredSubscriptions.length} assinaturas expiradas.`,
        );
      } else {
        this.logger.log('Nenhuma assinatura expirada encontrada.');
      }
    } catch (error) {
      this.logger.error('Erro ao processar assinaturas expiradas:', error);
    }
  }
}
