# Lexicon 1.1.1

## Sửa lỗi

- Sửa luồng cập nhật NSIS: setup mới dùng lại thư mục cài đã đăng ký và cài đè
  trực tiếp, không khởi chạy uninstaller cũ trước khi hook mới chạy.
- Giữ xử lý app đang mở theo cách đóng bình thường; không ép dừng tiến trình.
- Bản 1.1.1 dành cho người đang có Lexicon 1.1.0: chạy setup mới trực tiếp,
  không gỡ 1.1.0 trước.

## Đóng gói và xác minh

- Phiên bản được đồng bộ trong npm, Tauri và Cargo: `1.1.1`.
- Lệnh tạo installer: `cd frontend; npm run desktop:installer`.
- Frontend build và `npm run desktop:installer`: đạt.
- File: `frontend/src-tauri/target/release/bundle/nsis/Lexicon_1.1.1_x64-setup.exe` (3.04 MiB; 3,187,159 bytes).
- SHA-256: `BFB473C6E16E0D8D4E4ADD3435B67711F87C5348C08CF6757721C09BAD6D1262`.
- Đã kiểm tra script NSIS sinh ra có nhánh đọc lại thư mục cài và bỏ qua luồng
  chạy uninstaller cũ cho bản cài NSIS.
- Chưa xác nhận cài/nâng cấp thành công trên máy Windows có bản 1.1.0; cần người
  dùng chạy setup mới trực tiếp để xác nhận luồng thực tế.

## Ghi nhận lỗi và hướng dẫn lần sau

- Nhật ký lỗi: [INSTALLER_ERRORS.txt](INSTALLER_ERRORS.txt).
- Quy trình phát hành/cập nhật: [INSTALLER_UPDATE_GUIDE.md](INSTALLER_UPDATE_GUIDE.md).
