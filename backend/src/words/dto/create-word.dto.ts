// Import các decorator dùng để kiểm tra dữ liệu request.
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Mô tả dữ liệu bắt buộc khi tạo một từ mới.
export class CreateWordDto {
  // Từ tiếng Anh phải là chuỗi, không rỗng và tối đa 100 ký tự.
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

  @IsOptional()
  @IsString()
  @MaxLength(50)
  partOfSpeech?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
