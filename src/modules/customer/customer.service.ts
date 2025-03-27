import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { CustomerRepository } from './repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    userId: string,
    customerImage?: Express.Multer.File,
  ) {
    let customerImageUrl: string | undefined = undefined;
    const createdCustomer = await this.customerRepository.create(
      createCustomerDto,
      userId,
    );

    if (customerImage) {
      const fileExtension = customerImage.originalname.split('.').pop();
      const fileName = `${createdCustomer.id}.${fileExtension}`;

      await this.awsService.delete(
        fileName,
        this.envService.get('S3_CUSTOMER_IMAGES_FOLDER_PATH'),
      );

      customerImageUrl = await this.awsService.post(
        fileName,
        customerImage.buffer,
        this.envService.get('S3_CUSTOMER_IMAGES_FOLDER_PATH'),
      );
    }

    await this.customerRepository.updateImageUrl(
      createdCustomer.id,
      customerImageUrl,
      userId,
    );

    return;
  }

  async findAll(
    userId: string,
    { search, page, limit }: { search: string; page: number; limit: number },
  ) {
    return this.customerRepository.findAll({ userId, search, page, limit });
  }

  async findOne(id: string, userId: string) {
    return await this.customerRepository.findOne(id, userId);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    userId: string,
    customerImage?: Express.Multer.File,
  ) {
    let customerImageUrl: string | undefined = undefined;

    if (customerImage) {
      const fileExtension = customerImage.originalname.split('.').pop();
      const fileName = `${id}.${fileExtension}`;

      await this.awsService.delete(
        fileName,
        this.envService.get('S3_CUSTOMER_IMAGES_FOLDER_PATH'),
      );

      customerImageUrl = await this.awsService.post(
        fileName,
        customerImage.buffer,
        this.envService.get('S3_CUSTOMER_IMAGES_FOLDER_PATH'),
      );
    }

    return await this.customerRepository.update(id, updateCustomerDto, userId);
  }

  async remove(id: string, userId: string) {
    return await this.customerRepository.remove(id, userId);
  }
}
