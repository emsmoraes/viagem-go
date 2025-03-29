import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalRepository } from './repositories/proposal.repository';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';
import { extractFileName } from 'src/shared/helpers/extract-file-name';

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

    const proposal = await this.proposalRepository.findOne({
      proposalId,
      userId,
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    await Promise.all(
      proposal.destinations.flatMap((destination) =>
        (destination.images ?? []).map((imageUrl) =>
          this.awsService.delete(
            extractFileName(imageUrl, s3DestinationFolder),
            s3DestinationFolder,
          ),
        ),
      ),
    );

    await Promise.all(
      proposal.dayByDays.flatMap((destination) =>
        (destination.images ?? []).map((imageUrl) =>
          this.awsService.delete(
            extractFileName(imageUrl, s3DayByDayFolder),
            s3DayByDayFolder,
          ),
        ),
      ),
    );

    await this.awsService.delete(`${proposalId}.webp`, s3ProposalFolder);

    return await this.proposalRepository.delete({ proposalId, userId });
  }
}
