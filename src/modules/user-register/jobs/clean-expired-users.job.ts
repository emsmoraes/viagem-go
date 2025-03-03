import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserService } from '../user-register.service';

@Injectable()
export class CleanInactiveUsersJob {
  private readonly logger = new Logger(CleanInactiveUsersJob.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanInactiveUsers() {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));

      const usersToDelete = await this.prisma.user.findMany({
        where: {
          createdAt: { lte: oneDayAgo },
          password: null,
        },
      });

      if (usersToDelete.length > 0) {
        const deleteUserPromises = usersToDelete.map(async (user) => {
          this.userService.delete(user.id);

          this.logger.log(`Usuário ${user.id} deletado com sucesso.`);
        });

        await Promise.all(deleteUserPromises);

        this.logger.log(
          `${usersToDelete.length} usuários inativos foram removidos.`,
        );
      } else {
        this.logger.log('Nenhum usuário inativo encontrado para remover.');
      }
    } catch (error) {
      this.logger.error('Erro ao limpar usuários inativos:', error);
    }
  }
}
