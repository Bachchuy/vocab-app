// Import lỗi HTTP và decorator đánh dấu service injectable.
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// Import entity và các DTO của module.
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
// Import lớp truy cập dữ liệu.
import { WordsRepository } from './words.repository';

// Service là nơi đặt các quy tắc nghiệp vụ, không phải controller.
@Injectable()
export class WordsService {
  // NestJS inject repository để service không tự quản lý dữ liệu.
  constructor(private readonly wordsRepository: WordsRepository) {}

  // Lấy danh sách từ thông qua repository.
  findAll(): Word[] {
    return this.wordsRepository.findAll();
  }

  // Tìm một từ và báo 404 nếu không tồn tại.
  findOne(id: number): Word {
    const word = this.wordsRepository.findById(id);

    // Repository có thể trả về undefined nếu không tìm thấy.
    if (!word) {
      throw new NotFoundException(`Word with id ${id} not found`);
    }

    // Trả dữ liệu hợp lệ cho controller.
    return word;
  }

  // Tạo từ mới sau khi làm sạch dữ liệu đầu vào.
  create(createWordDto: CreateWordDto): Word {
    const english = createWordDto.english?.trim();
    // Trim giúp loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi.
    const meaning = createWordDto.meaning?.trim();

    // Đây là lớp bảo vệ thứ hai bên cạnh ValidationPipe.
    if (!english || !meaning) {
      throw new BadRequestException('english and meaning are required');
    }

    // Chỉ repository mới thực sự thêm object vào kho dữ liệu.
    return this.wordsRepository.create({
      ...createWordDto,
      english,
      meaning,
    });
  }

  // Cập nhật từ đã tồn tại.
  update(id: number, updateWordDto: UpdateWordDto): Word {
    const english = updateWordDto.english?.trim();
    // Lấy giá trị đã loại bỏ khoảng trắng để kiểm tra chuỗi rỗng.
    const meaning = updateWordDto.meaning?.trim();

    // Không cho phép biến một từ hợp lệ thành từ không có nội dung.
    if (updateWordDto.english !== undefined && !english) {
      throw new BadRequestException('english cannot be empty');
    }

    // Nghĩa cũng phải luôn có nội dung nếu được gửi lên để cập nhật.
    if (updateWordDto.meaning !== undefined && !meaning) {
      throw new BadRequestException('meaning cannot be empty');
    }

    const updatedWord = this.wordsRepository.update(id, updateWordDto);

    // Repository trả undefined nếu id không tồn tại.
    if (!updatedWord) {
      throw new NotFoundException(`Word with id ${id} not found`);
    }

    // Trả lại bản ghi sau khi cập nhật.
    return updatedWord;
  }

  // Xóa một từ theo id.
  delete(id: number): boolean {
    const isDeleted = this.wordsRepository.delete(id);

    // Nếu không có bản ghi phù hợp thì báo lỗi 404.
    if (!isDeleted) {
      throw new NotFoundException(`Word with id ${id} not found`);
    }

    // true cho biết thao tác xóa đã hoàn tất.
    return true;
  }
}
