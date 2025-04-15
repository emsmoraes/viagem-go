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
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { CustomerDocumentService } from './customer-document.service';
import { CreateCustomerDocumentsDto } from './dto/create-customer-document.dto';
import { UpdateCustomerDocumentDto } from './dto/update-customer-document.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('customer-document')
export class CustomerDocumentController {
  constructor(
    private readonly customerDocumentService: CustomerDocumentService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createCustomerDocumentDto: CreateCustomerDocumentsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log("DTODATA", createCustomerDocumentDto)
    console.log("files", files)
    return this.customerDocumentService.create(
      createCustomerDocumentDto,
      files,
    );
  }

  @Get()
  findAll() {
    return this.customerDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerDocumentService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('documents', 5, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateCustomerDocumentDto: UpdateCustomerDocumentDto,
    @UploadedFiles() documents: Express.Multer.File[],
  ) {
    return this.customerDocumentService.update(
      id,
      updateCustomerDocumentDto,
      documents,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerDocumentService.remove(id);
  }
}
