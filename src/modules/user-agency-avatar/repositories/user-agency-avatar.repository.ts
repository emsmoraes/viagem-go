import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class AgencyLogoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateAgencyLogo({
    agencyId,
    logoUrl,
  }: {
    agencyId: string;
    logoUrl: string;
  }) {
    return await this.prisma.agency.update({
      where: {
        id: agencyId,
      },
      data: {
        logoUrl,
      },
    });
  }

  async deleteAgencyLogo(agencyId: string) {
    return await this.prisma.agency.update({
      where: {
        id: agencyId,
      },
      data: {
        logoUrl: null,
      },
    });
  }
}