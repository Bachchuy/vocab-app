import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class ReviewWordDto {
  @IsIn(['again', 'hard', 'good', 'easy'])
  rating: 'again' | 'hard' | 'good' | 'easy';

  @IsOptional()
  @IsInt()
  @Min(0)
  responseMs?: number;
}
