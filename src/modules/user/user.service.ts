import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(user: CreateUserDto) {
    return this.userRepository.create(user);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  update(userId: string, data: UpdateUserDto) {
    return this.userRepository.UpdateById(userId, data);
  }
}
