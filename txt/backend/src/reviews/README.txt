HƯỚNG DẪN THƯ MỤC: backend/src/reviews

ReviewsController định nghĩa REST endpoint. ReviewsService đọc/cập nhật dữ liệu qua Prisma và dùng SimpleReviewScheduler để tính trạng thái tiếp theo.

review_states là trạng thái hiện tại (dueAt, status và các bộ đếm). review_history là lịch sử từng lần trả lời, có rating và reviewedAt. Service cập nhật state và thêm history trong cùng một transaction để hai bảng không lệch nhau.

Dashboard, streak và thành tích nên tính từ các sự kiện review_history; cần quy định timezone/ngày trước khi gom nhóm. Không đếm việc mở app thành một buổi học.

Lưu ý: desktop có logic SRS tương ứng trong frontend/src/services/vocabularyStore.ts. Khi thay đổi scheduler, giữ hành vi hai runtime đồng bộ và cập nhật tài liệu sản phẩm.
