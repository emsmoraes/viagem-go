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
import { CreateCruiseDto } from './dto/create-cruise.dto';
import { UpdateCruiseDto } from './dto/update-cruise.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { pdfFilter } from 'src/shared/helpers/pdf-filter';
import { CruiseService } from './cruise.service';

const storage = multer.memoryStorage();

@ApiTags('cruises')
@UseGuards(AuthGuard)
@Controller('cruises')
export class CruiseController {
  constructor(private readonly cruiseService: CruiseService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo cruzeiro' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'pdfs', maxCount: 5 },
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
          if (file.fieldname === 'pdfs') {
            return pdfFilter(req, file as any, callback);
          }
          callback(null, false);
        },
      },
    ),
  )
  async create(
    @Body() createCruiseDto: CreateCruiseDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      pdfs?: Express.Multer.File[];
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

    if (files.pdfs && files.pdfs.length > 0) {
      if (files.pdfs.length > 5) {
        throw new BadRequestException('Máximo de 5 PDFs por upload');
      }
      pdfFiles = files.pdfs;
    }

    return this.cruiseService.create(
      createCruiseDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os cruzeiros de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.cruiseService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um cruzeiro específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.cruiseService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um cruzeiro' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'pdfs', maxCount: 5 },
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
          if (file.fieldname === 'pdfs') {
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
    @Body() updateCruiseDto: UpdateCruiseDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      pdfs?: Express.Multer.File[];
    },
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;
    let pdfFiles: Express.Multer.File[] | undefined = undefined;

    if (files.images && files.images.length > 0) {
      webpFiles = await Promise.all(
        files.images.map(async (file) => await convertToWebP(file)),
      );
    }

    if (files.pdfs && files.pdfs.length > 0) {
      if (files.pdfs.length > 5) {
        throw new BadRequestException('Máximo de 5 PDFs por upload');
      }
      pdfFiles = files.pdfs;
    }

    return this.cruiseService.update(
      id,
      proposalId,
      updateCruiseDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um cruzeiro' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.cruiseService.remove(id, proposalId);
  }
}