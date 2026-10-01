// Import các decorator dùng để kiểm tra dữ liệu request.
import { ArrayMaxSize, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WordFormDto } from './word-form.dto';
import { VocabularySenseDto } from './vocabulary-sense.dto';
import { LearningGoalDto } from './learning-goal.dto';

// Mô tả dữ liệu bắt buộc khi tạo một từ mới.
export class CreateWordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  term?: string;

  // Mục từ trong ngôn ngữ đang học.
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  english: string;

  // Nghĩa của từ phải là chuỗi, không rỗng và tối đa 200 ký tự.
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  meaning: string;

  // Ví dụ là tùy chọn nhưng nếu có thì phải là chuỗi ngắn hơn 500 ký tự.
  @IsOptional()
  @IsString()
  @MaxLength(500)
  example?: string;

  // Category là tùy chọn và giúp nhóm các từ vựng.
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  // Nguồn tham khảo hoặc ngữ cảnh bắt gặp từ là tùy chọn.
  @IsOptional()
  @IsString()
  @MaxLength(200)
  source?: string;

  // Ghi chú riêng của học viên.
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
