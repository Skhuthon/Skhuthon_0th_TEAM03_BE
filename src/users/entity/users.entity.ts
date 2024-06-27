import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail } from 'class-validator';
import { emailValidationMessgae } from '../../common/validation-message/email-validation-message';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
  })
  @ApiProperty({
    example: 'dev123@kakao.com',
    description: '사용자 이메일',
    required: true,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessgae,
    },
  )
  email: string;
}
