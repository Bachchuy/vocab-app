// Import các decorator dùng để kiểm tra dữ liệu cập nhật.
import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WordFormDto } from './word-form.dto';

// Mô tả dữ liệu cho thao tác cập nhật một phần của từ.
export class UpdateWordDto {
  // Nếu gửi english thì phải là chuỗi không rỗng.
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

  @IsOptional()
  @IsString()
  @MaxLength(50)
  partOfSpeech?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional() @IsString() @MaxLength(80)
  pronunciation?: string;

  @IsOptional() @IsArray() @ArrayMaxSize(20) @ValidateNested({ each: true }) @Type(() => WordFormDto)
  wordForms?: WordFormDto[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  synonyms?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  antonyms?: string[];

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  collocations?: string[];

  @IsOptional() @IsString() @MaxLength(200)
  toeicContext?: string;
}
