import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { ProposalDayByDayRepository } from './repositories/proposal-day-by-day';
import { CreateProposalDayByDayDto } from './dto/create-proposal-day-by-day.dto';
import { UpdateProposalDayByDayDto } from './dto/update-proposal-day-by-day.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProposalDayByDayService {
  constructor(
    private readonly proposalDayByDayRepository: ProposalDayByDayRepository,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createProposalDayByDayDto: CreateProposalDayByDayDto,
    coverImages?: Express.Multer.File[],
  ) {
    let proposalCoverUrls: string[] = [];

    const data: Prisma.ProposalDayByDayCreateInput = {
      title: createProposalDayByDayDto.title,
      description: createProposalDayByDayDto.description,
      departureDate: createProposalDayByDayDto.departureDate,
      returnDate: createProposalDayByDayDto.returnDate,
      proposal: {
        connect: { id: createProposalDayByDayDto.proposalId },
      },
    };

    const createdDayByDay =
      await this.proposalDayByDayRepository.create(data);

    if (coverImages && coverImages.length > 0) {
      proposalCoverUrls = await Promise.all(
        coverImages.map(async (image) => {
          const fileExtension = image.originalname.split('.').pop();
          const fileName = `${createdDayByDay.id}-${crypto.randomUUID()}.${fileExtension}`;

          return this.awsService.post(
            fileName,
            image.buffer,
            this.envService.get('S3_PROPOSAL_DAY_BY_DAY_COVERS_FOLDER_PATH'),
          );
        }),
      );
    }

    return this.proposalDayByDayRepository.updateCoverUrls(
      createdDayByDay.id,
      proposalCoverUrls,
    );
  }

  findAll() {
    return this.proposalDayByDayRepository.findAll();
  }

  findOne(proposalDayByDayId: string, userId: string) {
    return this.proposalDayByDayRepository.findOne(
      proposalDayByDayId,
      userId,
    );
  }

  async update(
    proposalDayByDayId: string,
    userId: string,
    updateProposalDayByDayDto: UpdateProposalDayByDayDto,
    coverImages?: Express.Multer.File[],
  ) {
    const s3Folder = this.envService.get(
      'S3_PROPOSAL_DAY_BY_DAY_COVERS_FOLDER_PATH',
    );
    const existingDayByDay =
      await this.proposalDayByDayRepository.findOne(
        proposalDayByDayId,
        userId,
      );
    const storedImages = existingDayByDay?.images ?? [];

    const updatedImages = updateProposalDayByDayDto.existingImages ?? [];

    const imagesToDelete = storedImages.filter(
      (img) => !updatedImages.includes(img),
    );
    await Promise.all(
      imagesToDelete.map((imageUrl) => {
        const fileName = extractFileName(imageUrl, s3Folder);
        return this.awsService.delete(fileName, s3Folder);
      }),
    );

    if (coverImages?.length) {
      const newImageUrls = await Promise.all(
        coverImages.map(async (coverImage) => {
          const fileExtension = coverImage.originalname.split('.').pop();
          const fileName = `${proposalDayByDayId}-${crypto.randomUUID()}.${fileExtension}`;
          return this.awsService.post(fileName, coverImage.buffer, s3Folder);
        }),
      );
      updatedImages.push(...newImageUrls);
    }

    const data: Prisma.ProposalDayByDayUpdateInput = {
      title: updateProposalDayByDayDto.title,
      description: updateProposalDayByDayDto.description,
      departureDate: updateProposalDayByDayDto.departureDate,
      returnDate: updateProposalDayByDayDto.returnDate,
      images: updatedImages,
    };

    return this.proposalDayByDayRepository.update(
      proposalDayByDayId,
      userId,
      data,
    );
  }

  async remove(proposalDayByDayId: string, userId: string) {
    const s3Folder = this.envService.get('S3_PROPOSAL_DAY_BY_DAY_COVERS_FOLDER_PATH');
    
    const existingDayByDay = await this.proposalDayByDayRepository.findOne(proposalDayByDayId, userId);
    const images = existingDayByDay?.images ?? [];
  
    await Promise.all(images.map(imageUrl => this.awsService.delete(extractFileName(imageUrl, s3Folder), s3Folder)));
  
    return this.proposalDayByDayRepository.remove(proposalDayByDayId, userId);
  }
}
