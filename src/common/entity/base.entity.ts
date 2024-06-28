import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID', example: 1 })
  id: number;

  @UpdateDateColumn({
    nullable: true,
  })
  @Exclude()
  updatedAt: Date;

  @CreateDateColumn({
    nullable: true,
  })
  @Exclude()
  createdAt: Date;
}
