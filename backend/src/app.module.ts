// Import decorator Module của NestJS.
import { Module } from '@nestjs/common';
// Import module quản lý từ vựng.
import { WordsModule } from './words/words.module';

// Khai báo module gốc của ứng dụng.
@Module({
  // Đăng ký các module con mà ứng dụng cần sử dụng.
  imports: [WordsModule],
})
// Class này là điểm bắt đầu của dependency graph trong NestJS.
export class AppModule {}
