import { Module } from '@nestjs/common';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { SegmentRepository } from './repositories/segment.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [SegmentController],
  providers: [
    SegmentService,
    SegmentRepository,
    PrismaService
  ],
})
export class SegmentModule {} 