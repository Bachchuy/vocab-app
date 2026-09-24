// Repository hiện tại là lớp lưu dữ liệu tạm thời trong memory.
import { Injectable } from '@nestjs/common';
// Entity và DTO giúp dữ liệu được kiểm tra kiểu ở compile time.
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

// Cho phép NestJS inject repository vào service.
@Injectable()
export class WordsRepository {
  // Dữ liệu mẫu sẽ mất khi server restart; sau này thay bằng database.
  private readonly words: Word[] = [
    new Word(1, 'learn', 'học', 'I want to learn English every day.', 'daily'),
    new Word(2, 'practice', 'luyện tập', 'Practice makes progress.', 'study'),
    new Word(3, 'review', 'ôn tập', 'I review vocabulary every night.', 'revision'),
  ];

  // Id tiếp theo được cấp cho từ mới.
  private nextId = 4;

  // Trả về bản sao mảng để code bên ngoài không sửa trực tiếp kho dữ liệu.
  findAll(): Word[] {
    return [...this.words];
  }

  // Tìm phần tử đầu tiên có id tương ứng.
  findById(id: number): Word | undefined {
    return this.words.find((word) => word.id === id);
  }

  // Tạo object Word mới và thêm vào mảng.
  create(createWordDto: CreateWordDto): Word {
    const newWord = new Word(
      this.nextId++,
      createWordDto.english.trim(),
      createWordDto.meaning.trim(),
      createWordDto.example?.trim() ?? '',
      createWordDto.category?.trim() ?? 'general',
    );

    // Tăng id sau mỗi lần tạo để tránh trùng mã.
    this.words.push(newWord);
    return newWord;
  }

  // Tìm và cập nhật các field được gửi lên.
  update(id: number, updateWordDto: UpdateWordDto): Word | undefined {
    const word = this.words.find((item) => item.id === id);

    // Không tìm thấy thì service sẽ chuyển thành lỗi 404.
    if (!word) {
      return undefined;
    }

    // Giữ giá trị cũ cho field không xuất hiện trong PATCH.
    Object.assign(word, {
      english: updateWordDto.english?.trim() ?? word.english,
      meaning: updateWordDto.meaning?.trim() ?? word.meaning,
      example: updateWordDto.example?.trim() ?? word.example,
      category: updateWordDto.category?.trim() ?? word.category,
    });

    // Trả object đã cập nhật.
    return word;
  }

  // Xóa phần tử theo vị trí trong mảng.
  delete(id: number): boolean {
    const index = this.words.findIndex((word) => word.id === id);

    // -1 nghĩa là không có phần tử phù hợp.
    if (index === -1) {
      return false;
    }

    // splice xóa đúng một phần tử tại vị trí index.
    this.words.splice(index, 1);
    return true;
  }
}
