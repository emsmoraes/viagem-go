import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileRepository } from './repositories/user-profile.repository';

@Injectable()
export class UserProfileService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  findOne(id: string) {
    return this.userProfileRepository.getUserById(id);
  }

  update(id: string, data: UpdateUserProfileDto) {
    return this.userProfileRepository.UpdateUserById(id, data);
  }
}
