import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AgencyCreateInput) {
    return this.prisma.agency.create({
      data,
      include: {
        users: true,
      },
    });
  }

  async findById(agencyId: string) {
    return this.prisma.agency.findUnique({
      where: { id: agencyId },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.agency.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          omit: {
            password: true,
          },
          include: {
            userRoles: true,
          },
        },
      },
    });
  }

  async update(agencyId: string, data: Prisma.AgencyUpdateInput) {
    return this.prisma.agency.update({
      where: { id: agencyId },
      data,
    });
  }

  async delete(agencyId: string) {
    try {
      const deletedAgency = await this.prisma.agency.delete({
        where: { id: agencyId },
      });

      return deletedAgency;
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting agency');
    }
  }
}
