import * as sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';

export async function convertToWebP(file: Express.Multer.File): Promise<Express.Multer.File> {
  if (!file || !file.buffer) {
    throw new BadRequestException('Arquivo inválido ou buffer não encontrado.');
  }

  try {
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    return {
      ...file,
      buffer: webpBuffer,
      mimetype: 'image/webp',
      originalname: file.originalname.replace(/\.[^.]+$/, '.webp'),
    };
  } catch (error) {
    console.error('Erro ao converter imagem para WebP:', error);
    throw new BadRequestException(`Erro ao converter a imagem para WebP: ${error.message}`);
  }
}
