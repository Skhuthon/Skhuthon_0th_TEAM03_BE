import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { UsersModel } from '../../users/entity/users.entity';
import { Request } from 'express';

@Injectable()
export class IsReviewMine implements CanActivate {
  constructor(private readonly reviewService: ReviewsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    // Path Parameter로 reviewId를 받아옵니다.
    const reviewId = req.params.reviewId;

    if (!reviewId) {
      throw new BadRequestException('리뷰Id가 파라미터로 제공되어야합니다.');
    }
    const result = await this.reviewService.isReviewMine(
      user.id,
      parseInt(reviewId),
    );

    if (!result) {
      throw new UnauthorizedException('해당 리뷰를 수정할 권한이 없습니다.');
    }
    return true;
  }
}
