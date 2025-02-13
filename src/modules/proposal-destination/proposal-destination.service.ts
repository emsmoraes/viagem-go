import { Injectable } from '@nestjs/common';
import { CreateProposalDestinationDto } from './dto/create-proposal-destination.dto';
import { UpdateProposalDestinationDto } from './dto/update-proposal-destination.dto';
import { ProposalDestinationRepository } from './repositories/proposal-destination';
import { AwsService } from '../aws/aws.service';
import { EnvService } from '../env/env.service';

@Injectable()
export class ProposalDestinationService {
  constructor(
    private readonly proposalDestinationRepository: ProposalDestinationRepository,
    private readonly awsService: AwsService,
    private readonly envService: EnvService,
  ) {}

  async create(
    createProposalDestinationDto: CreateProposalDestinationDto,
    coverImage?: Express.Multer.File,
  ) {
    let proposalCoverUrl: string | undefined = undefined;

    const data = {
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

    if (coverImage) {
      const fileExtension = coverImage.originalname.split('.').pop();
      const fileName = `${createdDestination.id}.${fileExtension}`;

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

    return this.proposalDestinationRepository.updateCoverUrl(
      createdDestination.id,
      proposalCoverUrl,
    );
  }

  findAll() {
    return this.proposalDestinationRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} proposalDestination`;
  }

  update(
    id: number,
    updateProposalDestinationDto: UpdateProposalDestinationDto,
  ) {
    return `This action updates a #${id} proposalDestination`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposalDestination`;
  }
}
