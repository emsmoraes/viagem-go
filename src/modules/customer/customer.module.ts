import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { CustomerRepository } from './repositories/customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PrismaService,
    AwsService,
    EnvService,
    CustomerRepository,
  ],
})
export class CustomerModule {}
