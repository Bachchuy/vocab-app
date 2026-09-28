import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReviewWordDto } from './dto/review-word.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('due')
  findDue() {
    return this.reviewsService.findDue();
  }

  @Get('states')
  findStates() {
    return this.reviewsService.findStates();
  }

  @Post(':wordId')
  review(@Param('wordId', ParseIntPipe) wordId: number, @Body() dto: ReviewWordDto) {
    return this.reviewsService.review(wordId, dto);
  }

  @Get(':wordId/history')
  history(@Param('wordId', ParseIntPipe) wordId: number) {
    return this.reviewsService.findHistory(wordId);
  }
}
