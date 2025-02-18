import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { fileFilter } from '../../shared/helpers/images-filter';
import { convertToWebP } from 'src/shared/helpers/image-helper';

const storage = multer.memoryStorage();

@ApiTags('tickets')
@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo ticket' })
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;

    if (files && files.length > 0) {
      if (files.length > 5) {
        throw new BadRequestException('Máximo de 5 imagens por upload');
      }

      webpFiles = await Promise.all(
        files.map(async (file) => await convertToWebP(file)),
      );
    }

    return this.ticketService.create(createTicketDto, webpFiles);
  }

  @Get('proposal/:proposalId')
  @ApiOperation({ summary: 'Listar todos os tickets de uma proposta' })
  findAll(@Param('proposalId') proposalId: string) {
    return this.ticketService.findAll(proposalId);
  }

  @Get(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Buscar um ticket específico' })
  findOne(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.ticketService.findOne(id, proposalId);
  }

  @Patch(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Atualizar um ticket' })
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Param('proposalId') proposalId: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
  ) {
    let webpFiles: Express.Multer.File[] | undefined = undefined;

    if (files && files.length > 0) {
      webpFiles = await Promise.all(
        files.map(async (file) => await convertToWebP(file)),
      );
    }

    return this.ticketService.update(id, proposalId, updateTicketDto, webpFiles);
  }

  @Delete(':id/proposal/:proposalId')
  @ApiOperation({ summary: 'Remover um ticket' })
  remove(@Param('id') id: string, @Param('proposalId') proposalId: string) {
    return this.ticketService.remove(id, proposalId);
  }
} 