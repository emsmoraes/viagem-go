import {
  Controller,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { AuthGuard } from '../auth/auth.guard';
import { fileFilter } from '../../shared/helpers/images-filter';
import { ApiTags } from '@nestjs/swagger';
import { AgencyLogoService } from './user-agency-avatar.service';
import { AgencyService } from '../user-agency/user-agency.service';
import { AgencyLogoRepository } from './repositories/user-agency-avatar.repository';

const storage = multer.memoryStorage();

@ApiTags('agency-logo')
@Controller('agency-logo')
export class AgencyLogoController {
  constructor(
    private readonly agencyLogoService: AgencyLogoService,
    private readonly agencyService: AgencyService,
    private readonly agencyLogoRepository: AgencyLogoRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado ou inválido.');
    }

    const userId = req.user.userId;
    const agency = await this.agencyLogoRepository.findAgencyByUserId(userId);

    if (!agency) {
      throw new BadRequestException('Agência não encontrada.');
    }

    const webpFile = await convertToWebP(file);

    return this.agencyLogoService.update(agency.id, webpFile);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async remove(@Request() req) {
    const userId = req.user.userId;
    const agency = await this.agencyService.findByUserId(userId);

    if (!agency) {
      throw new BadRequestException('Agência não encontrada.');
    }

    return this.agencyLogoService.remove(agency.id);
  }
}