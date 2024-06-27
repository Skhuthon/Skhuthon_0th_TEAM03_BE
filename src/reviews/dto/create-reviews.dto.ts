import { PickType } from '@nestjs/swagger';
import { ReviewsModel } from '../entity/reviews.entity';

export class CreateReviewsDto extends PickType(ReviewsModel, [
  'author',
  'themeName',
  'isSuccess',
  'numberOfPeople',
  'numberOfHintsUsed',
  'remainingTime',
  'totalThemeTime',
  'content',
]) {
  email: string;
}
