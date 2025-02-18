import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './repositories/ticket.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Module({
  controllers: [TicketController],
  providers: [
    TicketService,
    TicketRepository,
    PrismaService,
    AwsService,
    EnvService,
  ],
})
export class TicketModule {} 