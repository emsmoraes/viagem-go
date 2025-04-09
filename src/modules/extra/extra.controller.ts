import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ExtraService } from './extra.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { pdfFilter } from 'src/shared/helpers/pdf-filter';

const storage = multer.memoryStorage();

@ApiTags('extras')
@UseGuards(AuthGuard)
@Controller('extras')
export class ExtraController {
  constructor(private readonly extraService: ExtraService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo extra' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'files', maxCount: 5 },
      ],
      {
        storage,
        limits: {
          fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
          if (file.fieldname === 'images') {
            return fileFilter(req, file, callback);
          }
          if (file.fieldname === 'files') {
            return pdfFilter(req, file as any, callback);
          }
          callback(null, false);
        },
      },
    ),
  )
  async create(
    @Body() createExtraDto: CreateExtraDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;
    let pdfFiles: Express.Multer.File[] | undefined = undefined;

    if (files.images && files.images.length > 0) {
      if (files.images.length > 5) {
        throw new BadRequestException('Máximo de 5 imagens por upload');
      }
      webpFiles = await Promise.all(
        files.images.map(async (file) => await convertToWebP(file)),
      );
    }

    if (files.files && files.files.length > 0) {
      if (files.files.length > 5) {
        throw new BadRequestException('Máximo de 5 PDFs por upload');
      }
      pdfFiles = files.files;
    }

    return this.extraService.create(createExtraDto, webpFiles, pdfFiles);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os extras de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.extraService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um extra específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.extraService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um extra' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'files', maxCount: 5 },
      ],
      {
        storage,
        limits: {
          fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
          if (file.fieldname === 'images') {
            return fileFilter(req, file, callback);
          }
          if (file.fieldname === 'files') {
            return pdfFilter(req, file as any, callback);
          }
          callback(null, false);
        },
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
    @Body() updateExtraDto: UpdateExtraDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;
    let pdfFiles: Express.Multer.File[] | undefined = undefined;

    if (files.images && files.images.length > 0) {
      webpFiles = await Promise.all(
        files.images.map(async (file) => await convertToWebP(file)),
      );
    }

    if (files.files && files.files.length > 0) {
      if (files.files.length > 5) {
        throw new BadRequestException('Máximo de 5 PDFs por upload');
      }
      pdfFiles = files.files;
    }

    return this.extraService.update(
      id,
      proposalId,
      updateExtraDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um extra' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.extraService.remove(id, proposalId);
  }
}