# Trường từ vựng và gợi ý AI

Mỗi mục từ có thể lưu nghĩa theo ngôn ngữ giải thích của người học, từ loại, phiên âm, câu ví dụ theo ngữ cảnh, ngữ cảnh học, họ từ, từ đồng nghĩa, từ trái nghĩa, collocation, nguồn gặp từ và ghi chú cá nhân. Ngôn ngữ nguồn, ngôn ngữ giải thích và mục tiêu học được chọn riêng; TOEIC chỉ là một hướng sử dụng, không phải mặc định của mô hình.

Chọn **Sửa** trên một mục từ để thay đổi trường dữ liệu. Phần họ từ dùng một dòng cho mỗi dạng:

```text
noun | acquisition | sự mua lại
adjective | acquisitive | có tính thu nhận
```

Nút **Gợi ý bằng AI** chỉ điền dữ liệu vào biểu mẫu, không tự động lưu. Hãy kiểm tra nội dung AI trước khi lưu. Một số từ không có từ trái nghĩa phù hợp nên danh sách đó có thể để trống.

## Bật tính năng gợi ý AI

Tính năng gợi ý gọi backend NestJS cục bộ, sau đó backend gọi OpenAI Responses API. Khóa API chỉ nằm ở backend, không đưa vào frontend hoặc ứng dụng desktop.

1. Mở `backend/.env`. Nếu chưa có, tạo bằng cách sao chép `backend/.env.example`.
2. Đặt `OPENAI_API_KEY` bằng khóa API của bạn. Có thể đặt thêm `OPENAI_MODEL` nếu tài khoản dùng model khác.
3. Chạy `npm run start:dev` trong thư mục `backend`.
4. Giữ backend đang chạy khi yêu cầu gợi ý. Ứng dụng desktop gọi backend tại `http://localhost:3000`.

Tính năng AI cần Internet và tài khoản API còn hạn mức. Từ điển vẫn hoạt động khi không bật AI. Không commit file `.env` và không chia sẻ khóa API.

## Cập nhật cơ sở dữ liệu và ứng dụng desktop

Trong thư mục `backend`, chạy:

```powershell
npm run db:generate
npx prisma migrate deploy
```

Sau đó trong thư mục `frontend`, chạy `npm run tauri build` để tạo bộ cài Windows mới. Cơ sở dữ liệu desktop cũng tự bổ sung các trường từ vựng còn thiếu khi ứng dụng khởi động.
