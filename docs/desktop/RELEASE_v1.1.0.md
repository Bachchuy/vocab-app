# Lexicon 1.1.0

## Thay đổi

- AI gợi ý nghĩa tiếng Việt tương đương ngắn (khoảng 2–3 từ) để ôn nhanh, và giải nghĩa chi tiết ở trường riêng.
- Giải nghĩa chi tiết được lưu cùng từ vựng, hiển thị ở trang chi tiết và có thể mở rộng trên thẻ ôn tập.
- Bổ sung màn Quản lý dữ liệu để nhập/xuất bản sao JSON Lexicon và xuất các từ đã chọn sang Excel.
- Installer NSIS đóng ứng dụng đang chạy khi cập nhật để tránh lỗi ghi đè file.

## Kiểm tra và bộ cài

- `frontend`: `npm run build` — đạt.
- `backend`: `npm run db:generate` và `npm run build` — đạt.
- `frontend`: `npm run desktop:installer` — đạt.
- File cài đặt: `frontend/src-tauri/target/release/bundle/nsis/Lexicon_1.1.0_x64-setup.exe` (x64, khoảng 3.05 MiB).

Bộ cài chưa ký số và chưa được xác minh bằng cài đặt/nâng cấp trên máy Windows sạch. Dữ liệu desktop và browser vẫn ở hai cơ sở dữ liệu riêng.
