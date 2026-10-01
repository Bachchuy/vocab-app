HƯỚNG DẪN THƯ MỤC: backend/src/words/dto

DTO (Data Transfer Object) mô tả dữ liệu đi qua HTTP boundary và gắn validation.
- create-word.dto.ts: body tạo từ.
- update-word.dto.ts: body cập nhật một phần.
- word-form.dto.ts: một biến thể trong họ từ.
ValidationPipe ở main.ts kiểm tra DTO trước khi request vào controller/service.
DTO không phải schema database; schema nằm ở backend/prisma/schema.prisma.
