LEXICON - BẢN ĐỒ HỌC VÀ HƯỚNG DẪN PROJECT
=========================================

Đọc file này trước nếu bạn mới biết viết code trong một file và muốn hiểu cách
project được mở rộng thành một ứng dụng có giao diện, backend và database.

TÀI LIỆU CHÍNH
--------------
00_TONG_QUAN_VA_LUONG_HOC.txt
  Giới thiệu sản phẩm, sơ đồ hệ thống, luồng dữ liệu, cách chạy và lộ trình học.

01_cai_dat_nodejs.txt
  Cài Node.js/npm và hiểu vai trò của chúng.

02_oop_architecture.txt
  Đọc kiến trúc nhiều tầng qua ví dụ thật trong backend Lexicon.

03_frontend_build.txt
  React, TypeScript, giao diện, state và tầng kết nối dữ liệu.

04_backend_build.txt
  NestJS, REST API, DTO, service, Prisma và database.

docs/V1_QUICKSTART.txt
  Các lệnh cài/chạy web và desktop, migration, installer và lưu ý dữ liệu.

docs/LEXICON_WINDOWS_DESKTOP_GUIDE.txt
  Cách hoạt động riêng của ứng dụng Tauri trên Windows.

docs/TOEIC_AI.md
  Cấu hình API key và sử dụng AI gợi ý trường từ vựng.

txt/frontend và txt/backend
  Giải thích vai trò của từng file source. Đây là tài liệu hướng dẫn, không phải
  mã nguồn ứng dụng; source thật nằm trong frontend/ và backend/.

SẢN PHẨM HIỆN CÓ
----------------
- Từ điển cá nhân: thêm, xem, sửa, xóa, tìm, lọc và sắp xếp.
- Trường TOEIC: từ loại, IPA, ví dụ công việc, họ từ, đồng/trái nghĩa,
  collocations, chủ đề, nguồn và ghi chú.
- Flashcard, đánh giá mức nhớ và lịch ôn ngắt quãng cơ bản.
- Dashboard với số từ, số đến hạn, số đã thuộc, lượt ôn và phân bố chủ đề.
- Nhập/xuất JSON cho từ vựng.
- Gợi ý nội dung bằng AI qua backend; người dùng sửa trước khi lưu.
- Web app dùng React; Windows desktop đóng gói bằng Tauri.

CÔNG NGHỆ
---------
- Frontend: React, TypeScript, Vite, CSS.
- Desktop: Tauri 2 và SQLite plugin.
- Backend: NestJS, TypeScript, REST/JSON.
- Backend database: SQLite qua Prisma ORM và migrations.
- AI: backend gọi OpenAI Responses API; API key đặt ở backend/.env.

ĐIỂM CẦN HIỂU TRƯỚC
-------------------
Desktop lưu từ và dữ liệu ôn trong SQLite cục bộ của app. Backend REST lưu ở
backend/prisma/dev.db. Hai kho dữ liệu này hiện chưa tự đồng bộ. AI trên desktop
cần backend chạy ở http://localhost:3000; các thao tác từ vựng cơ bản trên
desktop vẫn dùng local database.

CHẠY NHANH
----------
Từ PowerShell tại D:\code\vocab-app:

  powershell -ExecutionPolicy Bypass -File .\start-v1.ps1

Mở http://localhost:5173. Script mở cửa sổ backend và frontend; giữ chúng chạy
khi dùng web. Hướng dẫn cài mới, desktop và xử lý lỗi nằm trong docs/.

NGUYÊN TẮC HỌC
--------------
Đừng cố hiểu toàn bộ code cùng lúc. Chọn một hành vi nhỏ, ví dụ lưu một từ, rồi
theo dõi dữ liệu từ input -> React state -> vocabularyStore -> SQLite hoặc HTTP
-> backend service/repository -> database -> response -> giao diện cập nhật.

Mỗi file có một trách nhiệm. Controller nhận HTTP, service xử lý nghiệp vụ,
repository truy cập dữ liệu, DTO kiểm tra input, React component hiển thị và
nhận tương tác. Tách lớp để thay đổi một phần mà không phải viết lại cả app.

Lộ trình đề xuất: đọc 00 -> chạy app -> chọn một file trong frontend -> theo dõi
một request -> đọc controller/service/repository -> tự sửa một thay đổi nhỏ ->
chạy build -> ghi lại điều đã hiểu.

LƯU Ý AN TOÀN DỮ LIỆU
--------------------
- Không xóa backend/prisma/dev.db nếu muốn giữ dữ liệu backend.
- SQLite desktop là database riêng; xuất JSON để sao lưu từ vựng.
- Không commit file .env hoặc API key.
- Migration mới đã thêm trường TOEIC theo hướng giữ nguyên bản ghi cũ.
- Bộ cài đã được build, nhưng nên tự cài/chạy thử trên máy Windows của bạn.
