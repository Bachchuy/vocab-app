# Mục lục tài liệu

Đây là trang bắt đầu đọc tài liệu Lexicon. Các file trong `docs/` được chia theo chủ đề để phân biệt định hướng sản phẩm, hiện trạng kỹ thuật, cách sử dụng và quy trình phát triển.

## Đọc theo nhu cầu

### Tôi muốn hiểu sản phẩm

1. [Tầm nhìn và định hướng sản phẩm](product/PRODUCT_STRATEGY_VISION.md) — nguyên tắc, ý tưởng tính năng, thống kê, thành tích, chuỗi học và lộ trình đề xuất.
2. [Mô hình từ vựng](product/VOCABULARY_MODEL.md) — ý nghĩa các trường, ngữ cảnh/nguồn và quy tắc dữ liệu.

### Tôi muốn cài, dùng hoặc phát triển app

1. [Khởi động nhanh V1](desktop/V1_QUICKSTART.txt) — chạy web, desktop và tạo installer.
2. [Hướng dẫn desktop Windows](desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt) — kiến trúc, trạng thái hiện tại, dữ liệu, yêu cầu máy build và giới hạn.

### Tôi muốn làm việc với AI

1. [AI support](ai/AI_SUPPORT.md) — cách người dùng bật AI, luồng xử lý, bảo mật key và cách thêm provider/feature.
2. [Gợi ý trường từ vựng](ai/WORD_SUGGESTIONS.md) — các trường được gợi ý, bước xem lại và cập nhật lưu trữ.

### Tôi muốn phát triển và phát hành

1. [Lộ trình phát triển và học tập](development/ROADMAP_VOCAB_APP.md) — curriculum dài hạn, các mốc và Definition of Done.
2. [Git Flow](development/GIT_FLOW.md) — branch, commit, build và release.

## Tài liệu nào là nguồn hiện trạng?

| Tài liệu | Vai trò | Trạng thái |
|---|---|---|
| Tầm nhìn sản phẩm | Định hướng và đề xuất tương lai | Có cả mục tiêu chưa triển khai |
| Mô hình từ vựng | Ý nghĩa và quy ước của dữ liệu | Mô tả mô hình hiện tại và hướng mở rộng |
| Hướng dẫn AI | Tích hợp AI hiện tại và cách mở rộng | Tài liệu kỹ thuật đang dùng |
| Khởi động nhanh / Hướng dẫn desktop | Cách chạy và giới hạn nền tảng | Cần cập nhật khi lệnh hoặc trạng thái phát hành đổi |
| Lộ trình phát triển | Tài liệu học tập và ý tưởng dài hạn | Không phải cam kết thứ tự hoặc kiến trúc đã chọn |
| Git Flow | Quy trình làm việc với Git | Theo repository hiện tại |
| `huong_dan.md` ở thư mục gốc | Curriculum đời đầu | Tài liệu tham khảo cũ; dùng trang này và README mới để biết trạng thái thật |

## Quy tắc bảo trì tài liệu

- `README.md` ở gốc và trang này là điểm vào; thêm tài liệu mới thì cập nhật mục lục.
- Mã nguồn là nguồn đúng cuối cùng cho hành vi hiện tại. Đánh dấu rõ ý tưởng tương lai, chưa triển khai.
- Khi đổi luồng AI, cập nhật `ai/AI_SUPPORT.md` và hướng dẫn người dùng tương ứng.
- Khi đổi trường hoặc schema từ, cập nhật `product/VOCABULARY_MODEL.md`, migration/import/export và ví dụ liên quan.
- Khi đổi lệnh phát triển, đóng gói, vị trí dữ liệu hoặc giới hạn cài đặt, cập nhật hai hướng dẫn trong `desktop/`.
- `txt/docs/product/PRODUCT_STRATEGY_VISION.md.txt` và `txt/docs/development/ROADMAP_VOCAB_APP.md.txt` là bản văn bản dễ mở của hai tài liệu định hướng; cập nhật cùng file Markdown gốc.
- Các TXT/README khác trong `txt/` là tài liệu học/ghi chú đi kèm mã nguồn, không phải bản sao tự đồng bộ. Nếu thay đổi cấu trúc hoặc trách nhiệm của mã, cập nhật phần giải thích liên quan trong cùng thay đổi.
- Chú thích code chỉ nên giải thích lý do, giới hạn, tương thích dữ liệu hoặc ranh giới kiến trúc khó suy ra từ câu lệnh; tránh diễn giải lại từng dòng code.
