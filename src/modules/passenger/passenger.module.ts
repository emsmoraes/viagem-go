import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { PassengerRepository } from './repositories/passenger.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [PassengerController],
  providers: [
    PassengerService,
    PassengerRepository,
    PrismaService
  ],
})
export class PassengerModule {} 