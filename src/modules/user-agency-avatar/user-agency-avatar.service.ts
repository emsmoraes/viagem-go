import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { AgencyLogoRepository } from './repositories/user-agency-avatar.repository';

@Injectable()
export class AgencyLogoService {
  constructor(
    private readonly awsService: AwsService,
    private readonly agencyLogoRepository: AgencyLogoRepository,
    private readonly envService: EnvService,
  ) {}

  async update(agencyId: string, file: Express.Multer.File) {
    const fileName = `${agencyId}.webp`;

    await this.awsService.delete(fileName, this.envService.get('S3_AGENCY_LOGOS_FOLDER_PATH'));
    const logoUrl = await this.awsService.post(
      fileName,
      file.buffer,
      this.envService.get('S3_AGENCY_LOGOS_FOLDER_PATH'),
    );

    await this.agencyLogoRepository.updateAgencyLogo({ agencyId, logoUrl });

    return {
      logoUrl: logoUrl,
    };
  }

  async remove(agencyId: string) {
    const fileName = `${agencyId}.webp`;
    await this.awsService.delete(fileName, this.envService.get('S3_AGENCY_LOGOS_FOLDER_PATH'));
    await this.agencyLogoRepository.deleteAgencyLogo(agencyId);
    return {
      message: 'Logo da agência removida com sucesso!',
    };
  }
}