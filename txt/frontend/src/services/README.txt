HƯỚNG DẪN THƯ MỤC: frontend/src/services

vocabularyStore.ts là adapter dữ liệu được UI gọi. UI không cần biết dữ liệu nằm ở đâu:
- Trong Tauri desktop: plugin SQLite mở sqlite:lexicon.sqlite.
- Trong browser dev: gọi REST API NestJS tại VITE_API_URL (mặc định localhost:3000).

File này cũng chuẩn hóa model Word, import/export JSON, payload gửi backend và thao tác SRS cho desktop. Hai runtime hiện lưu ở hai kho riêng, chưa đồng bộ.

KHI SỬA MODEL
-------------
Cập nhật đồng bộ type, parse, create/update, import/export, SQLite columns/backfill và toApiWordPayload. Nếu trường đi qua browser, cập nhật DTO/entity/Prisma schema và migration backend. Kiểm tra dữ liệu cũ, đặc biệt alias toeicContext -> context.

SRS desktop hiện tính lịch tại đây; backend tính tại backend/src/reviews/review.scheduler.ts. Giữ công thức/status đồng bộ cho đến khi tách thành module dùng chung.

Tài liệu: docs/product/VOCABULARY_MODEL.md và docs/desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt.
