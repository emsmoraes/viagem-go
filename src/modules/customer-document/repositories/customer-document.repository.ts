import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateCustomerDocumentsDto } from '../dto/create-customer-document.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { customerId, documents }: CreateCustomerDocumentsDto,
    documentUrlsGrouped: string[][],
  ) {
    return Promise.all(
      documents.map((doc, index) => {
        const fileUrls = documentUrlsGrouped[index] ?? [];

        return this.prisma.customerDocument.create({
          data: {
            ...doc,
            customerId,
            fileUrls,
          },
        });
      }),
    );
  }

  async findAll() {
    return this.prisma.customerDocument.findMany();
  }

  async findOne(id: string) {
    return this.prisma.customerDocument.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCustomerDocumentDto: Prisma.CustomerDocumentUpdateInput,
    fileUrls: string[],
  ) {
    return this.prisma.customerDocument.update({
      where: { id },
      data: {
        ...updateCustomerDocumentDto,
        fileUrls,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.customerDocument.delete({
      where: { id },
    });
  }
}
