HƯỚNG DẪN THƯ MỤC: backend/src/words/dto

DTO là Data Transfer Object, dùng để mô tả dữ liệu đi qua API boundary.

File hiện tại:
- create-word.dto.ts: dữ liệu tạo mới.
- update-word.dto.ts: dữ liệu cập nhật một phần.

DTO không phải database entity. DTO bảo vệ service khỏi input tùy ý từ client và là nơi phù hợp để thêm validation decorators.
