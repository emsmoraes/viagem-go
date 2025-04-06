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
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { pdfFilter } from 'src/shared/helpers/pdf-filter';
import { InsuranceService } from './insurance.service';

const storage = multer.memoryStorage();

@ApiTags('insurances')
@UseGuards(AuthGuard)
@Controller('insurances')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo seguro' })
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
    @Body() createInsuranceDto: CreateInsuranceDto,
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

    return this.insuranceService.create(
      createInsuranceDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os seguros de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.insuranceService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um seguro específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.insuranceService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um seguro' })
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
    @Body() updateInsuranceDto: UpdateInsuranceDto,
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

    return this.insuranceService.update(
      id,
      proposalId,
      updateInsuranceDto,
      webpFiles,
      pdfFiles,
    );
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um seguro' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.insuranceService.remove(id, proposalId);
  }
}
