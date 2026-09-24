// Import hàm tạo ứng dụng NestJS.
import { NestFactory } from '@nestjs/core';
// Import module gốc, nơi tập hợp các module chức năng của backend.
import { AppModule } from './app.module';
// Import bộ lọc tự động kiểm tra dữ liệu request theo DTO.
import { ValidationPipe } from '@nestjs/common';

// Hàm khởi động server backend.
async function bootstrap() {
  // Tạo ứng dụng NestJS từ module gốc.
  const app = await NestFactory.create(AppModule);
  // Bật kiểm tra dữ liệu cho tất cả endpoint.
  app.useGlobalPipes(
    // whitelist loại bỏ field không được khai báo trong DTO.
    new ValidationPipe({
      // Chỉ giữ lại những property có decorator validation.
      whitelist: true,
      // Báo lỗi nếu client gửi field ngoài DTO thay vì âm thầm bỏ qua.
      forbidNonWhitelisted: true,
      // Cho phép Nest chuyển đổi kiểu dữ liệu khi cần.
      transform: true,
    }),
  );
  // Cho phép frontend khác origin gọi API trong giai đoạn phát triển.
  app.enableCors();
  // Dùng PORT từ environment, hoặc dùng cổng 3000 nếu chưa cấu hình.
  await app.listen(process.env.PORT ?? 3000);
  // In địa chỉ server để người mới biết backend đang chạy ở đâu.
  console.log('Backend is running on http://localhost:3000');
}

// Thực sự gọi hàm khởi động ứng dụng.
bootstrap();
