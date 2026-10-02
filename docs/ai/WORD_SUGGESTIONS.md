# Gợi ý AI cho mục từ

Tài liệu này mô tả những gì người dùng thấy và các trường liên quan tới luồng gợi ý. Phần thiết kế provider, lưu API key và xử lý lỗi nằm trong [AI support](AI_SUPPORT.md); định nghĩa đầy đủ các trường nằm trong [mô hình từ vựng](../product/VOCABULARY_MODEL.md).

## Trường có thể được gợi ý

AI hiện điền một bản nháp gồm nghĩa, ví dụ, CEFR, từ loại, văn phong, tần suất, phát âm, âm tiết, trọng âm, ngữ cảnh, senses, họ từ, từ đồng/trái nghĩa, collocations và mẫu ngữ pháp. Người dùng vẫn có thể sửa mọi trường trước khi lưu.

`source` là nơi người dùng bắt gặp từ (ví dụ tên phim hoặc bài báo). `context` là câu/tình huống giúp nhớ từ. Hai trường này không thay thế nhau. Mô hình và cách lưu được mô tả ở [VOCABULARY_MODEL.md](../product/VOCABULARY_MODEL.md).

## Luồng sử dụng

1. Nhập từ và các thông tin đã biết vào biểu mẫu.
2. Chọn **Gợi ý bằng AI** để chủ động gửi yêu cầu.
3. AI điền bản nháp; kết quả được kiểm tra kiểu dữ liệu và giới hạn trước khi hiển thị.
4. Đọc lại, sửa hoặc xóa gợi ý không phù hợp, sau đó tự lưu từ.

AI không tự lưu từ. Nghĩa không được bỏ trống; danh sách như trái nghĩa có thể để trống khi không có lựa chọn phù hợp. Không coi nội dung tạo sinh là nguồn học đáng tin cậy nếu chưa kiểm tra.

## Thiết kế cho TOEIC và mục tiêu khác

Mục tiêu học được truyền vào gợi ý như một ngữ cảnh, không đổi định nghĩa cốt lõi của từ. TOEIC, IELTS, tiếng Anh thương mại hoặc mục tiêu cá nhân nên là giá trị trong `learningGoals`, thay vì tạo schema riêng cho từng kỳ thi. Điều này giúp tái sử dụng cùng một provider và cùng feature cho các hướng học khác.

## Thay đổi schema hoặc giao diện

Khi thêm hoặc đổi trường gợi ý, đồng bộ các phần sau:

- `frontend/src/services/vocabularyStore.ts`: kiểu dữ liệu, lưu/đọc, import/export và ánh xạ payload.
- `frontend/src/ai/features/word-suggestions.ts`: schema, prompt và kiểm tra phản hồi.
- Form từ vựng: hiển thị, ánh xạ vào form và giữ quyền xem lại trước khi lưu.
- Backend DTO/entity/schema nếu trường đó đi qua luồng browser/backend.
- Tài liệu này và `docs/product/VOCABULARY_MODEL.md`.

Desktop SQLite và backend Prisma là hai kho độc lập; migration cho kho này không tự cập nhật kho kia. Xem hướng dẫn build và trạng thái nền tảng trong [desktop guide](../desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt).
