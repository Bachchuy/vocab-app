// Import các decorator mô tả HTTP endpoint của NestJS.
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
// DTO dùng để kiểm tra request tạo từ.
import { CreateWordDto } from './dto/create-word.dto';
// DTO dùng để kiểm tra request cập nhật từ.
import { UpdateWordDto } from './dto/update-word.dto';
// Kiểu dữ liệu trả về cho client.
import { Word } from './word.entity';
// Service xử lý nghiệp vụ phía sau controller.
import { WordsService } from './words.service';

// Tất cả endpoint trong class này đều bắt đầu bằng /words.
@Controller('words')
export class WordsController {
  // NestJS tự động truyền WordsService vào controller.
  constructor(private readonly wordsService: WordsService) {}

  // GET /words: lấy toàn bộ danh sách từ.
  @Get()
  findAll(): Word[] {
    // Controller chỉ chuyển tiếp request cho service.
    return this.wordsService.findAll();
  }

  // GET /words/:id: lấy một từ theo mã số.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Word {
    // ParseIntPipe đổi id từ chuỗi URL sang number và báo lỗi nếu không hợp lệ.
    return this.wordsService.findOne(id);
  }

  // POST /words: tạo một từ mới.
  @Post()
  create(@Body() createWordDto: CreateWordDto): Word {
    // Body đã được ValidationPipe kiểm tra trước khi tới đây.
    return this.wordsService.create(createWordDto);
  }

  // PATCH /words/:id: cập nhật một phần dữ liệu của từ.
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWordDto: UpdateWordDto,
  ): Word {
    // Gửi cả id và dữ liệu mới xuống service.
    return this.wordsService.update(id, updateWordDto);
  }

  // DELETE /words/:id: xóa một từ theo mã số.
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { success: boolean } {
    // Trả về trạng thái thành công để frontend biết kết quả.
    return { success: this.wordsService.delete(id) };
  }
}
