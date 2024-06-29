import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { UsersModel } from '../../users/entity/users.entity';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';
import { numberValidationMessage } from '../../common/validation-message/number-validation-message';
import { lengthValidationMessage } from '../../common/validation-message/length-validation-message';

@Entity('reviews')
export class ReviewsModel extends BaseModel {
  /**
   * 1. 플레이한 테마 이름: string
   * 2. 성공 여부: boolean
   * 3. 인원 수: number
   * 4. 힌트 사용 횟수: number
   * 5. 남은 시간: number
   * 6. 테마 총 시간: number
   * 7. 리뷰 내용: string
   */
  @ApiProperty({
    description: '리뷰 작성자',
    type: () => UsersModel,
  })
  @ManyToOne(() => UsersModel, (user) => user.reviews, {
    nullable: false,
  })
  author: UsersModel;

  @ApiProperty({
    example: '비밀의 가족',
    description: '플레이한 테마 이름',
  })
  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  themeName: string;

  @ApiProperty({
    example: true,
    description: '성공 여부',
  })
  @Column()
  @IsBoolean({
    message: '성공 여부는 boolean 타입이어야 합니다.',
  })
  isSuccess: boolean;

  @ApiProperty({
    example: 4,
    description: '인원 수',
  })
  @Column()
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  numberOfPeople: number;

  @ApiProperty({
    example: 2,
    description: '힌트 사용 횟수',
  })
  @Column()
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  numberOfHintsUsed: number;

  @ApiProperty({
    example: 10,
    description: '남은 시간',
  })
  @Column()
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  remainingTime: number;

  @ApiProperty({
    example: 60,
    description: '테마 총 시간',
  })
  @Column()
  @IsNumber(
    {},
    {
      message: numberValidationMessage,
    },
  )
  totalThemeTime: number;

  @ApiProperty({
    example: '인테리어가 너무 예쁘고 문제가 다양해서 재밌었어요!',
    description: '리뷰 내용',
  })
  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 500, {
    message: lengthValidationMessage,
  })
  content: string;
}
