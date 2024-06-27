import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const emailExist = await this.usersRepository.exists({
      where: {
        email: dto.email,
      },
    });
    if (emailExist) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userObject = this.usersRepository.create({
      email: dto.email,
    });
    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return;
    }
    return user;
  }
}
