# Hướng dẫn cập nhật bộ cài Lexicon trên Windows

Tài liệu này ghi lại quy trình phát hành và cập nhật sau lỗi `Failed to kill
Lexicon` ở release 1.1.0.

## Luồng cập nhật đã chọn

- Với bản cài do NSIS quản lý, chạy setup mới trực tiếp trên bản cũ. Setup đọc
  thư mục cài từ registry, bỏ qua trang gọi `uninstall.exe` cũ và cài đè các
  file chương trình tại cùng thư mục.
- Hook pre-install của setup mới kiểm tra đúng `Lexicon.exe` trong thư mục đó,
  yêu cầu ứng dụng đóng bình thường và không gọi `Process.Kill`.
- Không gỡ bản cũ trước khi nâng cấp. Bộ gỡ của bản cũ không thể được sửa bởi
  file setup mới và có thể chặn luồng cập nhật trước khi hook mới chạy.
- Cơ sở dữ liệu desktop nằm ngoài thư mục cài chương trình. Không xóa thư mục
  dữ liệu ứng dụng khi cập nhật; sao lưu trước các lần thay đổi schema.

## Khi chuẩn bị release mới

1. Làm trên branch release/hotfix phù hợp và đọc `docs/development/GIT_FLOW.md`.
2. Tăng cùng một phiên bản trong `frontend/package.json`,
   `frontend/package-lock.json`, `frontend/src-tauri/tauri.conf.json`,
   `frontend/src-tauri/Cargo.toml` và package `app` trong
   `frontend/src-tauri/Cargo.lock`.
3. Nếu đổi cài đặt, cập nhật cả `installer-template.nsi`,
   `installer-hooks.nsh` và script PowerShell tương ứng. Giữ nguyên nguyên tắc
   chỉ yêu cầu đóng app bình thường, không ép dừng process.
4. Cập nhật release notes, hướng dẫn cài đặt, mục lục tài liệu và
   `INSTALLER_ERRORS.txt` nếu có lỗi mới.
5. Build frontend rồi tạo installer bằng `npm run desktop:installer` trong
   `frontend`. Kiểm tra tên, phiên bản, kiến trúc, kích thước và SHA-256 file.
6. Kiểm tra output NSIS sinh ra: luồng update NSIS hiện có phải giữ thư mục cài
   cũ và không gọi `uninstall.exe` cũ. Kiểm tra staged diff để không đưa
   `target/`, `node_modules/`, database hoặc file tạm vào Git.
7. Trước khi công bố bản tương thích, xác minh trên Windows: cài mới; nâng cấp
   từ bản cũ đang đóng; nâng cấp khi app đang mở; người dùng hủy yêu cầu đóng;
   mở app sau cập nhật; xác nhận từ vựng và lịch ôn còn nguyên; gỡ bản mới sau
   khi cập nhật thành công.
8. Ghi chính xác kết quả build và kiểm thử trong release notes. Không coi build
   thành công là bằng chứng cài/nâng cấp đã chạy đúng trên Windows.
9. Commit đúng file, push branch release và gắn PR vào `main` theo Git Flow.

## Khôi phục cho người đang dùng 1.1.0

Chạy trực tiếp file `Lexicon_1.1.1_x64-setup.exe` trên bản đang cài. Không mở
Apps > Installed apps để gỡ trước và không xóa thư mục dữ liệu. Nếu Lexicon
đang mở, lưu công việc rồi đóng app; setup mới sẽ hỏi đóng app nếu còn process.
Nếu setup vẫn báo lỗi, dừng lại và gửi nội dung hộp thoại cùng
`%TEMP%\Lexicon-installer-close.log` để ghi vào error log.

## Giới hạn đã biết

Hành vi sửa lỗi này áp dụng cho setup NSIS của Lexicon. Việc chuyển đổi một bản
cài WiX cũ vẫn đi theo nhánh migration riêng của template Tauri. Bản phát hành
chưa được coi là xác minh hoàn tất cho đến khi nâng cấp được chạy thành công
trên Windows có bản 1.1.0 cũ.
