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
  Request,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { CreateProposalDayByDayDto } from './dto/create-proposal-day-by-day.dto';
import { UpdateProposalDayByDayDto } from './dto/update-proposal-day-by-day.dto';
import { ProposalDayByDayService } from './proposal-day-by-day.service';

const storage = multer.memoryStorage();

@Controller('proposal-day-by-day')
export class ProposalDayByDayController {
  constructor(
    private readonly proposalDayByDayService: ProposalDayByDayService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() createProposalDayByDayDto: CreateProposalDayByDayDto,
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;

    if (files && files.length > 0) {
      webpFiles = await Promise.all(
        files.map(async (file) => await convertToWebP(file)),
      );
    }

    return this.proposalDayByDayService.create(
      createProposalDayByDayDto,
      webpFiles,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.proposalDayByDayService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalDayByDayService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProposalDayByDayDto: UpdateProposalDayByDayDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
  ) {
    let webpFiles: Express.Multer.File[] = [];
    const userId = req.user.userId;

    if (files && files.length > 0) {
      webpFiles = await Promise.all(files.map((file) => convertToWebP(file)));
    }

    return this.proposalDayByDayService.update(
      id,
      userId,
      updateProposalDayByDayDto,
      webpFiles,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;

    this.proposalDayByDayService.remove(id, userId);
  }
}
