import { PickType } from '@nestjs/swagger';
import { ReviewsModel } from '../entity/reviews.entity';

export class CreateReviewsDto extends PickType(ReviewsModel, [
  'themeName',
  'isSuccess',
  'numberOfPeople',
  'numberOfHintsUsed',
  'remainingTime',
  'totalThemeTime',
  'content',
]) {
  content: string;
  totalThemeTime: number;
  remainingTime: number;
  numberOfHintsUsed: number;
  numberOfPeople: number;
  isSuccess: boolean;
  themeName: string;
}
