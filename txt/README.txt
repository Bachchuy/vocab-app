LEXICON - HƯỚNG DẪN ĐỌC KHO MÃ NGUỒN
====================================

BẮT ĐẦU TỪ ĐÂU
---------------
1. README.md: giới thiệu project và lệnh build cơ bản.
2. docs/README.md (hoặc docs/README.txt): mục lục tài liệu theo chủ đề.
3. docs/desktop/V1_QUICKSTART.txt: chạy web/desktop và tạo bộ cài Windows.
4. docs/desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt: kiến trúc và giới hạn desktop.

CÁC NHÓM TÀI LIỆU
-----------------
- docs/product/: tầm nhìn, thống kê/thành tích/chuỗi học và mô hình từ vựng.
- docs/ai/: cách dùng AI, provider và feature gợi ý từ.
- docs/desktop/: hướng dẫn chạy, dữ liệu và đóng gói Windows.
- docs/development/: curriculum dài hạn và Git Flow.
- txt/01-04_*.txt: tài liệu học Node, OOP, frontend và backend.
- txt/frontend/ và txt/backend/: ghi chú giải thích một số file source theo đường dẫn tương ứng.
- txt/docs/product/PRODUCT_STRATEGY_VISION.md.txt: bản text dễ đọc của tầm nhìn sản phẩm.
- txt/docs/development/ROADMAP_VOCAB_APP.md.txt: bản text dễ đọc của roadmap học tập.

TRẠNG THÁI KIẾN TRÚC
--------------------
- Frontend: React + TypeScript + Vite.
- Desktop: Tauri 2 + SQLite cục bộ.
- Browser: NestJS + Prisma + SQLite qua HTTP.
- Dữ liệu desktop và browser hiện chưa tự động đồng bộ.
- AI tùy chọn, dùng API key Gemini do người dùng tự cấu hình.
- Installer NSIS 1.0.0 đã build trên máy phát triển; chưa ký số và chưa được kiểm tra trên máy Windows sạch.

LỆNH CHẠY NHANH
---------------
Mở terminal 1:
  cd D:\code\vocab-app\backend
  npm install
  npm run start:dev

Mở terminal 2:
  cd D:\code\vocab-app\frontend
  npm install
  npm run dev

Mở http://localhost:5173

Tạo installer Windows từ thư mục frontend:
  npm run desktop:installer

CHÚ THÍCH VÀ GHI CHÚ TXT
------------------------
Thư mục txt/ có ghi chú học tập, không phải bản sao tự động của code. Nếu code đổi làm thay đổi luồng hoạt động hoặc trách nhiệm file, cập nhật README.txt liên quan trong cùng thay đổi.

huong_dan.md và docs/development/ROADMAP_VOCAB_APP.md là tài liệu curriculum/lộ trình, có thể chứa ý tưởng chưa làm. Dùng docs/README.md và code hiện tại để xác nhận trạng thái thật.
