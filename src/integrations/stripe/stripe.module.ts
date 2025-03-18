import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EnvService } from 'src/modules/env/env.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { ExpireSubscriptionsJob } from './jobs/update-expired-trials.job';

@Module({
  providers: [StripeService, EnvService, PrismaService, ExpireSubscriptionsJob],
  controllers: [StripeController],
})
export class StripeModule {}
