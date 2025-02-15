import { Module } from '@nestjs/common';
import { CustomerDocumentService } from './customer-document.service';
import { CustomerDocumentController } from './customer-document.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { CustomerDocumentRepository } from './repositories/customer-document.repository';

@Module({
  controllers: [CustomerDocumentController],
  providers: [CustomerDocumentService, PrismaService, AwsService, EnvService, CustomerDocumentRepository],
})
export class CustomerDocumentModule {}
