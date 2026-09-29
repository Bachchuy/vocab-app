import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReviewRating, SimpleReviewScheduler } from './review.scheduler';
import { ReviewWordDto } from './dto/review-word.dto';

@Injectable()
export class ReviewsService {
  private readonly scheduler = new SimpleReviewScheduler();

  constructor(private readonly prisma: PrismaService) {}

  async findDue() {
    const now = new Date();
    return this.prisma.word.findMany({
      where: {
        OR: [
          { reviewState: null },
          { reviewState: { dueAt: { lte: now } } },
        ],
      },
      include: { reviewState: true },
      orderBy: { id: 'asc' },
    });
  }

  async findStates() {
    return this.prisma.reviewState.findMany({
      select: { wordId: true, status: true, dueAt: true, lastReviewedAt: true, reviewCount: true, correctCount: true, incorrectCount: true, intervalDays: true },
    });
  }

  async findHistory(wordId: number) {
    return this.prisma.reviewHistory.findMany({
      where: { wordId },
      orderBy: { reviewedAt: 'desc' },
    });
  }

  async review(wordId: number, dto: ReviewWordDto) {
    const word = await this.prisma.word.findUnique({ where: { id: wordId } });
    if (!word) throw new NotFoundException(`Word with id ${wordId} not found`);

    const existing = await this.prisma.reviewState.findUnique({ where: { wordId } });
    const result = this.scheduler.schedule(dto.rating as ReviewRating, existing?.intervalDays ?? 0);
    const reviewCount = (existing?.reviewCount ?? 0) + 1;

    const state = await this.prisma.$transaction(async (transaction) => {
      const nextState = await transaction.reviewState.upsert({
        where: { wordId },
        create: { wordId, status: result.status, dueAt: result.dueAt, lastReviewedAt: new Date(), reviewCount, correctCount: result.correct ? 1 : 0, incorrectCount: result.correct ? 0 : 1, intervalDays: result.intervalDays },
        update: { status: result.status, dueAt: result.dueAt, lastReviewedAt: new Date(), reviewCount, correctCount: { increment: result.correct ? 1 : 0 }, incorrectCount: { increment: result.correct ? 0 : 1 }, intervalDays: result.intervalDays },
      });
      await transaction.reviewHistory.create({ data: { wordId, rating: dto.rating, correct: result.correct, responseMs: dto.responseMs } });
      return nextState;
    });

    return { word, review: state };
  }
}
