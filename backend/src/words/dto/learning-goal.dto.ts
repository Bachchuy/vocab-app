import { IsOptional, IsString, MaxLength } from 'class-validator';

export class LearningGoalDto {
  @IsString() @MaxLength(50)
  name: string;

  @IsOptional() @IsString() @MaxLength(30)
  level?: string;

  @IsOptional() @IsString() @MaxLength(200)
  notes?: string;
}