import { Injectable } from '@nestjs/common';
import { UserRegisterRepository } from './repositories/user-register.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRegisterRepository: UserRegisterRepository) {}

  create(user: CreateUserDto) {
    return this.userRegisterRepository.create(user);
  }

  update(key: string, data: UpdateUserDto) {
    return this.userRegisterRepository.UpdateByKey(key, data);
  }
}
