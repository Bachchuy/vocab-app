// Import các decorator dùng để kiểm tra dữ liệu cập nhật.
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
