import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string) {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.customer.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.customer.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
  ) {
    return this.prisma.customer.update({
      where: { id, userId },
      data: updateCustomerDto,
    });
  }

  async updateImageUrl(id: string, imageUrl: string, userId: string) {
    return this.prisma.customer.updateMany({
      where: { id, userId },
      data: { imageUrl },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.customer.deleteMany({
      where: { id, userId },
    });
  }
}
