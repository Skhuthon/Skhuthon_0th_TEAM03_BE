import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { UsersModel } from '../../users/entity/users.entity';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation-message';

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
  @ManyToOne(() => UsersModel, (user) => user.reviews, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  themeName: string;

  @Column()
  isSuccess: boolean;

  @Column()
  numberOfPeople: number;

  @Column()
  numberOfHintsUsed: number;

  @Column()
  remainingTime: number;

  @Column()
  totalThemeTime: number;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;
}
