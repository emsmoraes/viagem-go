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
import { AccommodationService } from './accommodation.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { pdfFilter } from 'src/shared/helpers/pdf-filter';

const storage = multer.memoryStorage();

@ApiTags('accommodations')
@UseGuards(AuthGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova hospedagem' })
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
    @Body() createAccommodationDto: CreateAccommodationDto,
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

    return this.accommodationService.create(
      createAccommodationDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todas as hospedagens de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.accommodationService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar uma hospedagem específica' })
  findOne(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
  ) {
    return this.accommodationService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar uma hospedagem' })
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
    @Body() updateAccommodationDto: UpdateAccommodationDto,
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

    return this.accommodationService.update(
      id,
      proposalId,
      updateAccommodationDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover uma hospedagem' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.accommodationService.remove(id, proposalId);
  }
} 