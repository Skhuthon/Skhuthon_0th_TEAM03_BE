import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsModel } from './entity/reviews.entity';
import { Repository } from 'typeorm';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsModel)
    private readonly reviewsRepository: Repository<ReviewsModel>,
  ) {}

  async getReviews() {
    return await this.reviewsRepository.find();
  }

  async createReview(authorId: number, reviewDto: CreateReviewsDto) {
    const review = this.reviewsRepository.create({
      author: {
        id: authorId,
      },
      ...reviewDto,
    });

    const newReview = await this.reviewsRepository.save(review);
    return newReview;
  }

  async updateReview(id: number, body: UpdateReviewsDto) {
    return await this.reviewsRepository.update(id, body);
  }

  async deleteReview(reviewId: number) {
    const post = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
      },
    });
    if (!post) {
      throw new NotFoundException('해당하는 리뷰를 찾을 수 없습니다.');
    }

    await this.reviewsRepository.delete(reviewId);

    return reviewId;
  }

  async isReviewMine(userId: number, reviewId: number): Promise<boolean> {
    const review = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
        author: {
          id: userId,
        },
      },
      relations: ['author'],
    });

    if (!review) {
      throw new NotFoundException('해당하는 리뷰를 찾을 수 없습니다.');
    }

    return true;
  }
}
