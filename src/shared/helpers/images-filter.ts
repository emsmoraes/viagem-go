import { BadRequestException } from "@nestjs/common";

export const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Apenas imagens são permitidas!'), false);
  }
  cb(null, true);
};