import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';
import { emailValidationMessgae } from '../../common/validation-message/email-validation-message';
import { lengthValidationMessage } from '../../common/validation-message/length-validation-message';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
  })
  @ApiProperty({
    example: 'dev123@gmail.com',
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

  @Column({
    unique: true,
  })
  @ApiProperty({
    example: 'dev123',
    description: '사용자 닉네임',
    required: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(2, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;
  @Column()
  @ApiProperty({
    example: '1234',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(6, 20, {
    message: lengthValidationMessage,
  })
  password: string;
}
