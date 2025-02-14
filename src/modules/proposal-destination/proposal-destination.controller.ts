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
} from '@nestjs/common';
import { ProposalDestinationService } from './proposal-destination.service';
import { CreateProposalDestinationDto } from './dto/create-proposal-destination.dto';
import { UpdateProposalDestinationDto } from './dto/update-proposal-destination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
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
    FileInterceptor('cover', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createProposalDestinationDto: CreateProposalDestinationDto,
  ) {
    let webpFile: Express.Multer.File | undefined = undefined;

    if (file) {
      webpFile = await convertToWebP(file);
    }
    return this.proposalDestinationService.create(
      createProposalDestinationDto,
      webpFile,
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
    FileInterceptor('cover', {
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
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    let webpFile: Express.Multer.File | undefined = undefined;
    const userId = req.user.userId;

    if (file) {
      webpFile = await convertToWebP(file);
    }

    return this.proposalDestinationService.update(
      id,
      userId,
      updateProposalDestinationDto,
      webpFile,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;

    this.proposalDestinationService.remove(id, userId);
  }
}
