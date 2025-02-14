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
  UploadedFile,
  Request,
  UploadedFiles,
} from '@nestjs/common';
import { ProposalDestinationService } from './proposal-destination.service';
import { CreateProposalDestinationDto } from './dto/create-proposal-destination.dto';
import { UpdateProposalDestinationDto } from './dto/update-proposal-destination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';

const storage = multer.memoryStorage();

@Controller('proposal-destination')
export class ProposalDestinationController {
  constructor(
    private readonly proposalDestinationService: ProposalDestinationService,
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
    @Body() createProposalDestinationDto: CreateProposalDestinationDto,
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;

    if (files && files.length > 0) {
      webpFiles = await Promise.all(
        files.map(async (file) => await convertToWebP(file)),
      );
    }

    return this.proposalDestinationService.create(
      createProposalDestinationDto,
      webpFiles,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.proposalDestinationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalDestinationService.findOne(id, userId);
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
    @Body() updateProposalDestinationDto: UpdateProposalDestinationDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
  ) {
    let webpFiles: Express.Multer.File[] = [];
    const userId = req.user.userId;

    if (files && files.length > 0) {
      webpFiles = await Promise.all(files.map((file) => convertToWebP(file)));
    }

    return this.proposalDestinationService.update(
      id,
      userId,
      updateProposalDestinationDto,
      webpFiles,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;

    this.proposalDestinationService.remove(id, userId);
  }
}
