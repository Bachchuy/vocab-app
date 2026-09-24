HƯỚNG DẪN THƯ MỤC: frontend/src

Đây là nơi chứa source code React.

Các file hiện tại:
- App.tsx: component gốc, form và danh sách từ.
- main.tsx: entry point khởi động React.
- index.css: style toàn cục.

Khi project lớn hơn, có thể thêm:
- components/: component tái sử dụng.
- pages/: màn hình theo route.
- services/: class gọi API.
- types/: interface/type dùng chung.
- hooks/: custom hooks.

Quy tắc:
UI component tập trung hiển thị và interaction. API/data logic nên tách ra service để dễ test và bảo trì.
