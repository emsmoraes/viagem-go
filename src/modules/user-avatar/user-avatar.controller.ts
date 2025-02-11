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
import { UserAvatarService } from './user-avatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { AuthGuard } from '../auth/auth.guard';

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Apenas imagens são permitidas!'), false);
  }
  cb(null, true);
};

const storage = multer.memoryStorage();

@Controller('user-avatar')
export class UserAvatarController {
  constructor(private readonly userAvatarService: UserAvatarService) {}

  @UseGuards(AuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado ou inválido.');
    }

    const userId = req.user.sub;

    const webpFile = await convertToWebP(file);

    return this.userAvatarService.update(userId, webpFile);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    const userId = req.user.sub;

    return this.userAvatarService.remove(userId);
  }
}
