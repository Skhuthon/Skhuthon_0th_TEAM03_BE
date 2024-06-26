import { PickType } from '@nestjs/swagger';
import { UsersModel } from '../entity/users.entity';

export class CreateUserDto extends PickType(UsersModel, [
  'email',
  'nickname',
]) {
  email: string;
  nickname: string;
}
