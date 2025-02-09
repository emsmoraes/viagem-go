import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserRegisterRepository } from '../user-register/repositories/user-register.repository';

@Injectable()
export class UserProfileService {
  constructor(private readonly userRegisterRepository: UserRegisterRepository) {}

  findOne(id: number) {
    return `This action returns a #${id} userProfile`;
  }

  update(id: string, data: UpdateUserProfileDto) {
    return this.userRegisterRepository.UpdateById(id, data);
  }
}
