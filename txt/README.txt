LEXICON V1 - HƯỚNG DẪN CHUNG

1. Mục tiêu
Xây một từ điển cá nhân có review. V1 là local web app chạy trên Windows, dùng React, NestJS, Prisma và SQLite. Tauri desktop đang được chuẩn bị cho giai đoạn sau.

2. Công nghệ hiện tại
- Frontend: React + TypeScript + Vite.
- Backend: NestJS + TypeScript.
- Giao tiếp: HTTP/JSON.
- Lưu trữ V1: SQLite qua Prisma tại backend/prisma/dev.db.
- Review: ReviewState, ReviewHistory và SimpleReviewScheduler.

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

4. Cách chạy nhanh
Từ thư mục gốc chạy:

powershell -ExecutionPolicy Bypass -File .\start-v1.ps1

Script mở hai PowerShell: backend và frontend. Sau đó mở http://localhost:5173.
Xem hướng dẫn đầy đủ tại docs/V1_QUICKSTART.txt.

5. Cấu trúc hướng dẫn
Các file 01-04 là hướng dẫn theo giai đoạn.
Thư mục txt/frontend và txt/backend mirror cấu trúc source. Ví dụ:
frontend/src/App.tsx
-> txt/frontend/src/App.tsx.txt

Mỗi file mirror giải thích đúng file tương ứng: mục đích, từng phần, luồng dữ liệu và cách mở rộng.

6. Kiến trúc hiện tại
Frontend: React -> vocabularyStore adapter -> Tauri SQLite hoặc NestJS HTTP.
Backend: main.ts -> AppModule -> WordsModule/ReviewsModule -> Controller -> Service -> PrismaRepository.

7. Quy tắc học và phát triển
- Mỗi class/module có một trách nhiệm chính.
- Controller chỉ nhận request và trả response.
- Service chứa business logic.
- Repository quản lý dữ liệu.
- DTO mô tả input từ client.
- Chạy build sau mỗi thay đổi quan trọng.

8. Lưu ý dữ liệu
Dữ liệu V1 không mất khi backend restart vì được lưu trong SQLite. Không xóa backend/prisma/dev.db nếu muốn giữ dữ liệu local. Không commit file database hoặc .env.

Tauri shell nằm tại frontend/src-tauri. Chưa có installer Windows vì máy build còn thiếu Visual C++ Build Tools/link.exe.

9. Nếu VS Code hiện file đỏ
- Chạy npm run build trong đúng thư mục frontend hoặc backend.
- Đọc lỗi trong terminal thay vì chỉ dựa vào màu Explorer.
- Chọn TypeScript: Restart TS Server.
- Chọn Developer: Reload Window nếu Explorer chưa cập nhật.
