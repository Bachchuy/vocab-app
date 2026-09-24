// Import decorator module của NestJS.
import { Module } from '@nestjs/common';
// Controller nhận request HTTP liên quan đến từ vựng.
import { WordsController } from './words.controller';
// Repository chịu trách nhiệm lưu và tìm dữ liệu.
import { WordsRepository } from './words.repository';
// Service chứa nghiệp vụ của module từ vựng.
import { WordsService } from './words.service';

// Đóng gói controller và các provider của chức năng words.
@Module({
  // Cho NestJS biết class nào nhận request.
  controllers: [WordsController],
  // Đăng ký các class có thể được inject vào constructor.
  providers: [WordsService, WordsRepository],
  // Cho module khác dùng được WordsService nếu cần.
  exports: [WordsService],
})
export class WordsModule {}
