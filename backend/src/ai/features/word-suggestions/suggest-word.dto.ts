import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SuggestWordDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  term: string;

  @IsOptional() @IsString() @MaxLength(200)
  meaning?: string;

  @IsOptional() @IsString() @MaxLength(500)
  source?: string;

  @IsOptional() @IsString() @MaxLength(10)
  sourceLanguage?: string;

  @IsOptional() @IsString() @MaxLength(10)
  explanationLanguage?: string;

  @IsOptional() @IsString() @MaxLength(200)
  learningGoal?: string;
}
