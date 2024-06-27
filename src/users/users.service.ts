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
  ) {
  }

  async createUser(dto: CreateUserDto) {
    const nicknameExist: boolean = await this.usersRepository.exists({
      where: {
        nickname: dto.nickname,
      },
    });

    if (nicknameExist) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }
    const emailExist = await this.usersRepository.exists({
      where: {
        email: dto.email,
      },
    });
    if (emailExist) {
      throw new BadRequestException('이미 가입한 이메일입니다.');
    }

    const userObject = this.usersRepository.create({
      email: dto.email,
      nickname: dto.nickname,
    });
    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('존재하지 않는 이메일입니다.');
    }
    return user;
  }
}
