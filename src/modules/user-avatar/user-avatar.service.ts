import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { UserAvatarRepository } from './repositories/user-avatar.repository';
import { EnvService } from '../env/env.service';

@Injectable()
export class UserAvatarService {
  constructor(
    private readonly awsService: AwsService,
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly envService: EnvService
  ) {}

  async update(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new Error('Arquivo não enviado');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${userId}.${fileExtension}`;

    await this.awsService.delete(fileName, this.envService.get("S3_USER_AVATARS_FOLDER_PATH"));
    const avatarUrl = await this.awsService.post(
      fileName,
      file.buffer,
      this.envService.get("S3_USER_AVATARS_FOLDER_PATH")
    );

    await this.userAvatarRepository.updateUserAvatar({ userId, avatarUrl });

    return {
      message: 'Avatar atualizado com sucesso!',
      fileName: file.filename,
      path: file.path,
    };
  }

  async remove(id: string) {
    const fileName = `${id}.webp`;
    await this.awsService.delete(fileName, this.envService.get("S3_USER_AVATARS_FOLDER_PATH"));
    await this.userAvatarRepository.deleteAvatar(id);
  }
}
