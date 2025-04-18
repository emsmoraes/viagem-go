import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalRepository } from './repositories/proposal.repository';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';
import { deleteImagesAndFiles } from 'src/shared/helpers/deleteImages-and-files';

@Injectable()
export class ProposalService {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(data: CreateProposalDto, userId: string) {
    return this.proposalRepository.create({ title: data.title, userId });
  }

  async findAll(
    userId: string,
    { search, page, limit }: { search: string; page: number; limit: number },
  ) {
    return this.proposalRepository.findAll({ userId, search, page, limit });
  }

  async findOne(proposalId: string, userId: string) {
    const proposal = await this.proposalRepository.findOne({
      userId,
      proposalId: proposalId,
    });
    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    return proposal;
  }

  async update(
    proposalId: string,
    updateProposalDto: UpdateProposalDto,
    userId: string,
    coverImage?: Express.Multer.File,
  ) {
    let proposalCoverUrl: string | undefined = undefined;

    if (coverImage) {
      const fileExtension = coverImage.originalname.split('.').pop();
      const fileName = `${proposalId}.${fileExtension}`;

      await this.awsService.delete(
        fileName,
        this.envService.get('S3_PROPOSAL_COVERS_FOLDER_PATH'),
      );

      proposalCoverUrl = await this.awsService.post(
        fileName,
        coverImage.buffer,
        this.envService.get('S3_PROPOSAL_COVERS_FOLDER_PATH'),
      );
    }

    return await this.proposalRepository.update({
      proposalId: proposalId,
      data: updateProposalDto,
      userId,
      proposalCoverUrl,
    });
  }

  async remove(proposalId: string, userId: string) {
    const s3ProposalFolder = this.envService.get(
      'S3_PROPOSAL_COVERS_FOLDER_PATH',
    );
    const s3DestinationFolder = this.envService.get(
      'S3_PROPOSAL_DESTINATION_COVERS_FOLDER_PATH',
    );
    const s3DayByDayFolder = this.envService.get(
      'S3_PROPOSAL_DAY_BY_DAY_COVERS_FOLDER_PATH',
    );
    const s3TicketImagesFolder = this.envService.get(
      'S3_TICKET_IMAGES_FOLDER_PATH',
    );
    const s3TicketFilesFolder = this.envService.get(
      'S3_TICKET_PDFS_FOLDER_PATH',
    );
    const s3AccommodationImagesFolder = this.envService.get(
      'S3_ACCOMMODATION_IMAGES_FOLDER_PATH',
    );
    const s3AccommodationFilesFolder = this.envService.get(
      'S3_ACCOMMODATION_PDFS_FOLDER_PATH',
    );
    const s3CruiseImagesFolder = this.envService.get(
      'S3_CRUISE_IMAGES_FOLDER_PATH',
    );
    const s3CruiseFilesFolder = this.envService.get(
      'S3_CRUISE_PDFS_FOLDER_PATH',
    );
    const s3TransportImagesFolder = this.envService.get(
      'S3_TRANSPORT_IMAGES_FOLDER_PATH',
    );
    const s3TransportFilesFolder = this.envService.get(
      'S3_TRANSPORT_PDFS_FOLDER_PATH',
    );
    const s3ExperiencesImagesFolder = this.envService.get(
      'S3_EXPERIENCE_IMAGES_FOLDER_PATH',
    );
    const s3ExperiencesFilesFolder = this.envService.get(
      'S3_EXPERIENCE_PDFS_FOLDER_PATH',
    );
    const s3InsurancesImagesFolder = this.envService.get(
      'S3_INSURANCE_IMAGES_FOLDER_PATH',
    );
    const s3InsurancesFilesFolder = this.envService.get(
      'S3_INSURANCE_PDFS_FOLDER_PATH',
    );
    const s3ExtraImagesFolder = this.envService.get(
      'S3_EXTRA_IMAGES_FOLDER_PATH',
    );
    const s3ExtraFilesFolder = this.envService.get(
      'S3_EXTRA_PDFS_FOLDER_PATH',
    );

    const proposal = await this.proposalRepository.findOne({
      proposalId,
      userId,
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    await deleteImagesAndFiles(
      [
        {
          key: s3DestinationFolder,
          data: proposal.destinations,
          type: 'images',
        },
        { key: s3DayByDayFolder, data: proposal.dayByDays, type: 'images' },
        { key: s3TicketImagesFolder, data: proposal.tickets, type: 'images' },
        { key: s3TicketFilesFolder, data: proposal.tickets, type: 'files' },
        {
          key: s3AccommodationImagesFolder,
          data: proposal.accommodations,
          type: 'images',
        },
        {
          key: s3AccommodationFilesFolder,
          data: proposal.accommodations,
          type: 'files',
        },
        {
          key: s3CruiseImagesFolder,
          data: proposal.cruises,
          type: 'images',
        },
        {
          key: s3CruiseFilesFolder,
          data: proposal.cruises,
          type: 'files',
        },
        {
          key: s3TransportImagesFolder,
          data: proposal.transports,
          type: 'images',
        },
        {
          key: s3TransportFilesFolder,
          data: proposal.transports,
          type: 'files',
        },
        {
          key: s3ExperiencesImagesFolder,
          data: proposal.experiences,
          type: 'images',
        },
        {
          key: s3ExperiencesFilesFolder,
          data: proposal.experiences,
          type: 'files',
        },
        {
          key: s3InsurancesImagesFolder,
          data: proposal.insurances,
          type: 'images',
        },
        {
          key: s3InsurancesFilesFolder,
          data: proposal.insurances,
          type: 'files',
        },
        {
          key: s3ExtraImagesFolder,
          data: proposal.extras,
          type: 'images',
        },
        {
          key: s3ExtraFilesFolder,
          data: proposal.extras,
          type: 'files',
        },
      ],
      this.awsService,
    );

    await this.awsService.delete(`${proposalId}.webp`, s3ProposalFolder);
    return await this.proposalRepository.delete({ proposalId, userId });
  }
}
