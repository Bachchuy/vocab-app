HƯỚNG DẪN THƯ MỤC: frontend/src-tauri/src

lib.rs khởi tạo Tauri, plugin SQLite và các command được phép invoke từ frontend. Các command AI đọc/ghi/xóa Gemini API key trên Windows Credential Manager; không ghi key vào SQLite từ vựng hay log.

Trong windows_credentials, các hàm Win32 CredReadW/CredWriteW/CredDeleteW là FFI và sử dụng con trỏ unsafe. Khi sửa, phải đảm bảo bộ đệm wide string và secret còn sống trong thời gian Win32 sử dụng; pointer đọc từ Credential Manager phải được CredFree giải phóng sau khi đã copy dữ liệu cần giữ.

Entry point desktop: main.rs -> lib.rs::run(). Cấu hình capability/plugin nằm trong frontend/src-tauri/capabilities và tauri.conf.json.
