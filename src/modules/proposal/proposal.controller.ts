import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { AuthGuard } from '../auth/auth.guard';
import { fileFilter } from '../../shared/helpers/images-filter';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { convertToWebP } from 'src/shared/helpers/image-helper';

const storage = multer.memoryStorage();

@UseGuards(AuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  create(@Body() createProposalDto: CreateProposalDto, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.create(createProposalDto, userId);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('search') search: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.userId;
    return this.proposalService.findAll(userId, { search, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.findOne(id, userId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const userId = req.user.userId;
    let webpFile: Express.Multer.File | undefined = undefined;

    if (file) {
      webpFile = await convertToWebP(file);
    }

    return this.proposalService.update(id, updateProposalDto, userId, webpFile);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.proposalService.remove(id, userId);
  }
}
