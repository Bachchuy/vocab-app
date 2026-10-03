// Import các decorator dùng để kiểm tra dữ liệu cập nhật.
import { ArrayMaxSize, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WordFormDto } from './word-form.dto';
import { VocabularySenseDto } from './vocabulary-sense.dto';
import { LearningGoalDto } from './learning-goal.dto';

// Mô tả dữ liệu cho thao tác cập nhật một phần của từ.
export class UpdateWordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  term?: string;

  // Nếu gửi mục từ thì phải là chuỗi không rỗng.
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  english?: string;

  // Nếu gửi meaning thì phải là chuỗi không rỗng.
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  meaning?: string;

  @IsOptional() @IsString() @MaxLength(1200)
  detailedExplanation?: string;

  // Có thể cập nhật ví dụ nhưng không bắt buộc phải gửi field này.
  @IsOptional()
  @IsString()
  @MaxLength(500)
  example?: string;

  // Có thể cập nhật nhóm từ nhưng không bắt buộc phải gửi field này.
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lemma?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  sourceLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  explanationLanguage?: string;

  @IsOptional() @IsString() @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', ''])
  cefrLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  partOfSpeech?: string;

  @IsOptional() @IsString() @MaxLength(30)
  register?: string;

  @IsOptional() @IsString() @MaxLength(30)
  frequency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional() @IsString() @MaxLength(80)
  pronunciation?: string;

  @IsOptional() @IsString() @MaxLength(80)
  pronunciationUS?: string;

  @IsOptional() @IsString() @MaxLength(80)
  pronunciationUK?: string;

  @IsOptional() @IsString() @MaxLength(50)
  syllables?: string;

  @IsOptional() @IsString() @MaxLength(80)
  stressPattern?: string;

  @IsOptional() @IsString() @MaxLength(500)
  etymology?: string;

  @IsOptional() @IsString() @MaxLength(500)
  usageNotes?: string;

  @IsOptional() @IsArray() @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => WordFormDto)
  wordForms?: WordFormDto[];

  @IsOptional() @IsArray() @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => VocabularySenseDto)
  senses?: VocabularySenseDto[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  synonyms?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  antonyms?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  collocations?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true })
  grammarPatterns?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => LearningGoalDto)
  learningGoals?: LearningGoalDto[];

  @IsOptional() @IsString() @MaxLength(200)
  context?: string;
}
