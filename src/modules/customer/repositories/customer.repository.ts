import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: string) {
    const { numberOfChildren, ...rest } = createCustomerDto;

    return this.prisma.customer.create({
      data: {
        ...rest,
        numberOfChildren: numberOfChildren
          ? Number(numberOfChildren)
          : undefined,
        userId,
      },
    });
  }

  async findAll({
    userId,
    search = '',
    page = 1,
    limit = 10,
  }: {
    userId: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          fullName: {
            contains: search,
            mode: 'insensitive' as 'insensitive',
          },
        }
      : {};

    const totalItems = await this.prisma.customer.count({
      where: {
        userId,
        ...searchCondition,
      },
    });

    const customers = await this.prisma.customer.findMany({
      where: {
        userId,
        ...searchCondition,
      },
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      customers,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async findOne(id: string, userId: string) {
    return this.prisma.customer.findFirst({
      where: { id, userId },
      include: {
        documents: true
      }
    });
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
  ) {
    const { numberOfChildren, ...rest } = updateCustomerDto;

    return this.prisma.customer.update({
      where: { id, userId },
      data: {
        ...rest,
        numberOfChildren:
          numberOfChildren !== undefined ? Number(numberOfChildren) : undefined,
      },
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
