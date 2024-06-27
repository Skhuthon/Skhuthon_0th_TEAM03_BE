import { PickType } from '@nestjs/swagger';
import { UsersModel } from '../entity/users.entity';

export class CreateUserDto extends PickType(UsersModel, [
  'nickname',
  'email',
]) {}
