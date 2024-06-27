import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail } from 'class-validator';
import { emailValidationMessgae } from '../../common/validation-message/email-validation-message';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewsModel } from '../../reviews/entity/reviews.entity';

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
  @OneToMany(() => ReviewsModel, (review) => review.author)
  reviews: ReviewsModel[];
}
