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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IsReviewMine } from './guard/is-review-mine';
import { User } from '../users/decorator/user.decorator';
import { UsersModel } from '../users/entity/users.entity';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { CreateReviewsDto } from './dto/create-reviews.dto';

@ApiTags('테마 리뷰')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: '테마 리뷰 목록 조회' })
  @Get()
  @UseGuards(AccessTokenGuard)
  async getReviews() {
    // return await this.reviewsService.getReviews();
  }

  @ApiOperation({ summary: '테마 리뷰 작성하기' })
  @Post()
  @UseGuards(AccessTokenGuard)
  async postReviews(@User() user: UsersModel, @Body() body: CreateReviewsDto) {
    return await this.reviewsService.createReview(user.id, body);
  }

  @ApiOperation({ summary: '테마 리뷰 수정하기' })
  @UseGuards(AccessTokenGuard)
  @UseGuards(IsReviewMine)
  @Patch(':reviewId')
  async patchReviews(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewsDto,
  ) {
    return await this.reviewsService.updateReview(id, body);
  }

  @ApiOperation({ summary: '테마 리뷰 삭제하기' })
  @UseGuards(AccessTokenGuard)
  @UseGuards(IsReviewMine)
  @Delete('reviewId')
  deleteReviews(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.deleteReview(id);
  }
}
