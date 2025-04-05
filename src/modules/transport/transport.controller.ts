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
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { pdfFilter } from 'src/shared/helpers/pdf-filter';
import { TransportService } from './transport.service';

const storage = multer.memoryStorage();

@ApiTags('transports')
@UseGuards(AuthGuard)
@Controller('transports')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo transporte' })
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
    @Body() createTransportDto: CreateTransportDto,
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

    return this.transportService.create(
      createTransportDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os transportes de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.transportService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um transporte específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.transportService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um transporte' })
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
    @Body() updateTransportDto: UpdateTransportDto,
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

    return this.transportService.update(
      id,
      proposalId,
      updateTransportDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um transporte' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.transportService.remove(id, proposalId);
  }
}
