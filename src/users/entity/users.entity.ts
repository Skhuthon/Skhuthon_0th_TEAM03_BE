import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';
import { emailValidationMessgae } from '../../common/validation-message/email-validation-message';
import { lengthValidationMessage } from '../../common/validation-message/length-validation-message';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
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
  @IsString({
    message: stringValidationMessage,
  })
  @Length(2, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;
}
