VOCAB APP - HƯỚNG DẪN CHUNG

1. Mục tiêu
Xây một ứng dụng học từ vựng bằng React, TypeScript và NestJS. Phiên bản hiện tại tập trung vào CRUD words để học cách tổ chức code trước khi thêm database, authentication, flashcard và AI.

2. Công nghệ hiện tại
- Frontend: React + TypeScript + Vite.
- Backend: NestJS + TypeScript.
- Giao tiếp: HTTP/JSON.
- Lưu trữ hiện tại: mảng in-memory trong WordsRepository.
- Database: chưa dùng ở giai đoạn đầu.

3. Cách chạy project
Mở terminal 1:
cd D:\code\vocab-app\backend
$env:Path += ";C:\Program Files\nodejs"
npm install
npm run start:dev

Mở terminal 2:
cd D:\code\vocab-app\frontend
$env:Path += ";C:\Program Files\nodejs"
npm install
npm run dev

Mở trình duyệt tại:
http://localhost:5173

API kiểm tra tại:
http://localhost:3000/words

4. Cấu trúc hướng dẫn
Các file 01-04 là hướng dẫn theo giai đoạn.
Thư mục txt/frontend và txt/backend mirror cấu trúc source. Ví dụ:
frontend/src/App.tsx
-> txt/frontend/src/App.tsx.txt

Mỗi file mirror giải thích đúng file tương ứng: mục đích, từng phần, luồng dữ liệu và cách mở rộng.

5. Kiến trúc hiện tại
Frontend: main.tsx -> App.tsx -> fetch API.
Backend: main.ts -> AppModule -> WordsModule -> Controller -> Service -> Repository.

6. Quy tắc học và phát triển
- Mỗi class/module có một trách nhiệm chính.
- Controller chỉ nhận request và trả response.
- Service chứa business logic.
- Repository quản lý dữ liệu.
- DTO mô tả input từ client.
- Chạy build sau mỗi thay đổi quan trọng.

7. Lưu ý dữ liệu
Dữ liệu hiện tại mất khi backend restart. Đây là chủ ý để học OOP và API trước. Khi cần lưu lâu dài, thay repository bằng Prisma/PostgreSQL.

8. Nếu VS Code hiện file đỏ
- Chạy npm run build trong đúng thư mục frontend hoặc backend.
- Đọc lỗi trong terminal thay vì chỉ dựa vào màu Explorer.
- Chọn TypeScript: Restart TS Server.
- Chọn Developer: Reload Window nếu Explorer chưa cập nhật.
