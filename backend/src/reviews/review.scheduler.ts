export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type ScheduleResult = {
  status: 'learning' | 'familiar' | 'mastered';
  dueAt: Date;
  intervalDays: number;
  correct: boolean;
};

export class SimpleReviewScheduler {
  schedule(rating: ReviewRating, currentIntervalDays: number): ScheduleResult {
    const now = new Date();
    if (rating === 'again') {
      return { status: 'learning', dueAt: new Date(now.getTime() + 10 * 60 * 1000), intervalDays: 0, correct: false };
    }

    const multiplier = rating === 'hard' ? 1 : rating === 'good' ? 2 : 4;
    const intervalDays = Math.max(1, currentIntervalDays ? currentIntervalDays * multiplier : multiplier);
    const status = rating === 'easy' && intervalDays >= 30 ? 'mastered' : intervalDays >= 7 ? 'familiar' : 'learning';
    const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    return { status, dueAt, intervalDays, correct: true };
  }
}
