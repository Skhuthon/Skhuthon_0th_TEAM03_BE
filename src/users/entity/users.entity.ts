import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  email: string;
}
