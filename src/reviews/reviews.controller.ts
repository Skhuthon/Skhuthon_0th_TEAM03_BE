import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { User } from '../users/decorator/user.decorator';
import { UsersModel } from '../users/entity/users.entity';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { CreateReviewsDto } from './dto/create-reviews.dto';

@ApiTags('테마 리뷰 API')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: '테마 리뷰 목록 조회' })
  @ApiResponse({ status: 200, description: '리뷰 목록 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Get()
  @UseGuards(AccessTokenGuard)
  async getReviews(@User() user: UsersModel) {
    return await this.reviewsService.getReviews(user.id);
  }

  @ApiOperation({ summary: '테마 리뷰 상세 조회' })
  @ApiParam({ name: 'reviewId', required: true, description: '리뷰 ID' })
  @ApiResponse({ status: 200, description: '리뷰 상세 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Get(':reviewId')
  @UseGuards(AccessTokenGuard)
  async getReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return await this.reviewsService.getReviewbyReviewId(reviewId);
  }

  @ApiOperation({ summary: '테마 리뷰 작성하기' })
  @ApiBody({ type: CreateReviewsDto })
  @ApiResponse({ status: 201, description: '리뷰 작성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Post()
  @UseGuards(AccessTokenGuard)
  async postReviews(@User() user: UsersModel, @Body() body: CreateReviewsDto) {
    return await this.reviewsService.createReview(user.id, body);
  }

  @ApiOperation({ summary: '테마 리뷰 수정하기' })
  @ApiParam({ name: 'reviewId', required: true, description: '리뷰 ID' })
  @ApiBody({ type: UpdateReviewsDto })
  @ApiResponse({ status: 200, description: '리뷰 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '자신의 리뷰가 아니라 권한 없음' })
  @UseGuards(AccessTokenGuard)
  @Patch(':reviewId')
  async patchReviews(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() body: UpdateReviewsDto,
  ) {
    return await this.reviewsService.updateReview(reviewId, body);
  }

  @ApiOperation({ summary: '테마 리뷰 삭제하기' })
  @ApiBearerAuth()
  @ApiParam({ name: 'reviewId', required: true, description: '리뷰 ID' })
  @ApiResponse({ status: 200, description: '리뷰 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '자신의 리뷰가 아니라 권한 없음' })
  @UseGuards(AccessTokenGuard)
  @Delete(':reviewId')
  deleteReviews(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewsService.deleteReview(reviewId);
  }
}
