import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date;

  @CreateDateColumn({
    nullable: true,
  })
  createdAt: Date;
}
