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

  async getReviews(id: number) {
    return await this.reviewsRepository.find({
      where: {
        id,
      },
    });
  }

  async getReviewbyReviewId(reviewId: number) {
    const review = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
      },
    });
    if (!review) {
      throw new NotFoundException('해당하는 리뷰를 찾을 수 없습니다.');
    }
    return review;
  }

  async createReview(authorId: number, reviewDto: CreateReviewsDto) {
    const review = await this.reviewsRepository.create({
      author: {
        id: authorId,
      },
      ...reviewDto,
    });
    if (reviewDto.isSuccess === true) {
      // 유저의 성공 횟수를 1 증가시킨다.
      review.author.successCount += 1;
    }

    const newReview = await this.reviewsRepository.save(review);
    console.log(newReview);
    return newReview;
  }

  async updateReview(id: number, body: UpdateReviewsDto) {
    await this.reviewsRepository.update(id, body);
    const updatedReview = await this.reviewsRepository.findOne({
      where: {
        id,
      },
    });
    return updatedReview;
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
