import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column()
  nickname: string;

  @Column()
  email: string;
}
