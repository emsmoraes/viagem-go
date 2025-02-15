import { Injectable } from '@nestjs/common';
import { CreateProposalDestinationDto } from './dto/create-proposal-destination.dto';
import { UpdateProposalDestinationDto } from './dto/update-proposal-destination.dto';
import { ProposalDestinationRepository } from './repositories/proposal-destination';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProposalDestinationService {
  constructor(
    private readonly proposalDestinationRepository: ProposalDestinationRepository,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createProposalDestinationDto: CreateProposalDestinationDto,
    coverImages?: Express.Multer.File[],
  ) {
    let proposalCoverUrls: string[] = [];

    const data: Prisma.ProposalDestinationCreateInput = {
      name: createProposalDestinationDto.name,
      description: createProposalDestinationDto.description,
      departureDate: createProposalDestinationDto.departureDate,
      returnDate: createProposalDestinationDto.returnDate,
      proposal: {
        connect: { id: createProposalDestinationDto.proposalId },
      },
    };

    const createdDestination =
      await this.proposalDestinationRepository.create(data);

    if (coverImages && coverImages.length > 0) {
      proposalCoverUrls = await Promise.all(
        coverImages.map(async (image) => {
          const fileExtension = image.originalname.split('.').pop();
          const fileName = `${createdDestination.id}-${crypto.randomUUID()}.${fileExtension}`;

          return this.awsService.post(
            fileName,
            image.buffer,
            this.envService.get('S3_PROPOSAL_DESTINATION_COVERS_FOLDER_PATH'),
          );
        }),
      );
    }

    console.log(proposalCoverUrls);

    return this.proposalDestinationRepository.updateCoverUrls(
      createdDestination.id,
      proposalCoverUrls,
    );
  }

  findAll() {
    return this.proposalDestinationRepository.findAll();
  }

  findOne(proposalDestinationId: string, userId: string) {
    return this.proposalDestinationRepository.findOne(
      proposalDestinationId,
      userId,
    );
  }

  async update(
    proposalDestinationId: string,
    userId: string,
    updateProposalDestinationDto: UpdateProposalDestinationDto,
    coverImages?: Express.Multer.File[],
  ) {
    const s3Folder = this.envService.get(
      'S3_PROPOSAL_DESTINATION_COVERS_FOLDER_PATH',
    );
    const existingDestination =
      await this.proposalDestinationRepository.findOne(
        proposalDestinationId,
        userId,
      );
    const storedImages = existingDestination?.images ?? [];

    const updatedImages = updateProposalDestinationDto.existingImages ?? [];

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
          const fileName = `${proposalDestinationId}-${crypto.randomUUID()}.${fileExtension}`;
          return this.awsService.post(fileName, coverImage.buffer, s3Folder);
        }),
      );
      updatedImages.push(...newImageUrls);
    }

    const data: Prisma.ProposalDestinationUpdateInput = {
      name: updateProposalDestinationDto.name,
      description: updateProposalDestinationDto.description,
      departureDate: updateProposalDestinationDto.departureDate,
      returnDate: updateProposalDestinationDto.returnDate,
      images: updatedImages,
    };

    return this.proposalDestinationRepository.update(
      proposalDestinationId,
      userId,
      data,
    );
  }

  async remove(proposalDestinationId: string, userId: string) {
    const s3Folder = this.envService.get(
      'S3_PROPOSAL_DESTINATION_COVERS_FOLDER_PATH',
    );

    const existingDestination =
      await this.proposalDestinationRepository.findOne(
        proposalDestinationId,
        userId,
      );
    const images = existingDestination?.images ?? [];

    await Promise.all(
      images.map((imageUrl) =>
        this.awsService.delete(extractFileName(imageUrl, s3Folder), s3Folder),
      ),
    );

    return this.proposalDestinationRepository.remove(
      proposalDestinationId,
      userId,
    );
  }
}
