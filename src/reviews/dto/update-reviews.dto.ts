import { CreateReviewsDto } from './create-reviews.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewsDto extends PartialType(CreateReviewsDto) {}
