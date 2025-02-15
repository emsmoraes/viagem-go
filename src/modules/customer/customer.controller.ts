import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { convertToWebP } from 'src/shared/helpers/image-helper';
import { fileFilter } from '../../shared/helpers/images-filter';

const storage = multer.memoryStorage();
@UseGuards(AuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const userId = req.user.userId;

    let webpFile: Express.Multer.File | undefined = undefined;

    if (file) {
      webpFile = await convertToWebP(file);
    }

    return this.customerService.create(createCustomerDto, userId, webpFile);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.customerService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.customerService.findOne(id, userId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const userId = req.user.userId;
    let webpFile: Express.Multer.File | undefined = undefined;

    if (file) {
      webpFile = await convertToWebP(file);
    }

    return this.customerService.update(id, updateCustomerDto, userId, webpFile);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.customerService.remove(id, userId);
  }
}
