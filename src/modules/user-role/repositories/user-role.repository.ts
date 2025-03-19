import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserRoles } from '@prisma/client';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assignRole(userId: string, agencyId: string, role: UserRoles) {
    return await this.prisma.userRole.create({
      data: {
        userId,
        agencyId,
        role,
      },
    });
  }

  async updateRole(userId: string, agencyId: string, role: UserRoles) {
    const existingRole = await this.prisma.userRole.findFirst({
      where: { userId, agencyId },
    });

    if (!existingRole) {
      throw new NotFoundException('Função do usuário não encontrada');
    }

    return await this.prisma.userRole.update({
      where: {
        userId_agencyId: { userId, agencyId },
      },
      data: { role },
    });
  }

  async removeRole(userId: string, agencyId: string) {
    const existingRole = await this.prisma.userRole.findFirst({
      where: { userId, agencyId },
    });

    if (!existingRole) {
      throw new NotFoundException('Função do usuário não encontrada');
    }

    return await this.prisma.userRole.delete({
      where: {
        userId_agencyId: { userId, agencyId },
      },
    });
  }

  async getRolesByUser(userId: string) {
    return await this.prisma.userRole.findMany({
      where: { userId },
      include: { agency: true },
    });
  }

  async deleteByUserId(userId: string) {
    return await this.prisma.userRole.deleteMany({
      where: { userId },
    });
  }

  async findByUserId(userId: string) {
    return await this.prisma.userRole.findMany({
      where: { userId },
      include: { agency: true },
    });
  }
}
