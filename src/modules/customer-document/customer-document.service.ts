import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDocumentDto } from './dto/create-customer-document.dto';
import { UpdateCustomerDocumentDto } from './dto/update-customer-document.dto';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { CustomerDocumentRepository } from './repositories/customer-document.repository';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerDocumentService {
  constructor(
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
    private readonly customerDocumentRepository: CustomerDocumentRepository,
  ) {}

  async create(
    createCustomerDocumentDto: CreateCustomerDocumentDto,
    documents: Express.Multer.File[],
  ) {
    if (!documents || documents.length === 0) {
      throw new BadRequestException('At least one document file is required.');
    }

    const documentUrls = await Promise.all(
      documents.map(async (document) => {
        const fileExtension = document.originalname.split('.').pop();
        const fileName = `${createCustomerDocumentDto.customerId}-${crypto.randomUUID()}.${fileExtension}`;
        return await this.awsService.post(
          fileName,
          document.buffer,
          this.envService.get('S3_CUSTOMER_DOCUMENTS_FOLDER_PATH'),
        );
      }),
    );

    return this.customerDocumentRepository.create(
      createCustomerDocumentDto,
      documentUrls,
    );
  }

  findAll() {
    return this.customerDocumentRepository.findAll();
  }

  findOne(id: string) {
    return this.customerDocumentRepository.findOne(id);
  }

  async update(
    id: string,
    updateCustomerDocumentDto: UpdateCustomerDocumentDto,
    newDocumentFiles?: Express.Multer.File[],
  ) {
    const customerDocumentData: Prisma.CustomerDocumentUpdateInput = {
      name: updateCustomerDocumentDto.name,
      expirationDate: updateCustomerDocumentDto.expirationDate,
      issueDate: updateCustomerDocumentDto.issueDate,
    };

    const existingDocument = await this.customerDocumentRepository.findOne(id);

    if (!existingDocument) {
      throw new NotFoundException(`Customer document with ID ${id} not found.`);
    }

    const storedUrls = existingDocument.fileUrls ?? [];
    const updatedUrls = updateCustomerDocumentDto.existingDocumentUrls ?? [];

    const urlsToDelete = storedUrls.filter((url) => !updatedUrls.includes(url));

    await Promise.all(
      urlsToDelete.map((url) => {
        const fileName = extractFileName(
          url,
          'S3_CUSTOMER_DOCUMENTS_FOLDER_PATH',
        );
        return this.awsService.delete(
          fileName,
          'S3_CUSTOMER_DOCUMENTS_FOLDER_PATH',
        );
      }),
    );

    if (newDocumentFiles?.length) {
      const newImageUrls = await Promise.all(
        newDocumentFiles.map(async (file) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${id}-${crypto.randomUUID()}.${fileExtension}`;
          return this.awsService.post(
            fileName,
            file.buffer,
            'S3_CUSTOMER_DOCUMENTS_FOLDER_PATH',
          );
        }),
      );
      updatedUrls.push(...newImageUrls);
    }

    return this.customerDocumentRepository.update(
      id,
      customerDocumentData,
      updatedUrls,
    );
  }

  async remove(id: string) { 
    const existingDocument = await this.customerDocumentRepository.findOne(id);

    if (!existingDocument) {
      throw new NotFoundException(`Customer document with ID ${id} not found.`);
    }

    const fileUrls = existingDocument.fileUrls ?? [];
    const s3Folder = 'S3_CUSTOMER_DOCUMENTS_FOLDER_PATH';

    await Promise.all(
      fileUrls.map((imageUrl) => {
        const fileName = extractFileName(
          imageUrl,
          'S3_CUSTOMER_DOCUMENTS_FOLDER_PATH',
        );
        return this.awsService.delete(fileName, s3Folder);
      }),
    );

    return this.customerDocumentRepository.remove(id);
  } 
}
