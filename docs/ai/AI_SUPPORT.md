# AI support trong Lexicon

Tài liệu này ghi lại cách bật AI bằng API key cá nhân, luồng gợi ý từ hiện tại và cách mở rộng sang provider hoặc tác vụ AI khác. AI là tùy chọn: tra cứu, lưu từ và ôn tập vẫn hoạt động khi chưa cấu hình key. Xem [mục lục tài liệu](../README.md) để tìm các hướng dẫn khác và [gợi ý AI cho mục từ](WORD_SUGGESTIONS.md) để biết chi tiết trường dữ liệu.

## Hướng dẫn cho người dùng

1. Mở **Cài đặt AI** trong thanh bên.
2. Mở [Google AI Studio](https://aistudio.google.com/app/apikey), đăng nhập và tạo Gemini API key.
3. Dán key vào Lexicon, chọn **Lưu API key**, rồi chọn **Kiểm tra kết nối**.
4. Trong biểu mẫu từ, nhập từ cần học và chọn **Gợi ý bằng AI**. Xem lại nội dung, chỉnh sửa nếu cần, rồi tự lưu.

Lexicon không thu phí AI. Yêu cầu dùng quota và điều khoản của tài khoản/provider người dùng. Gemini 3.1 Flash-Lite hiện liệt kê Free Tier; hạn mức và điều khoản có thể thay đổi. Với Free Tier, dữ liệu gửi tới Google có thể được dùng để cải thiện sản phẩm. Từ, nghĩa đang có và câu ngữ cảnh được gửi trực tiếp đến Google khi người dùng yêu cầu gợi ý. Không gửi dữ liệu nhạy cảm. Đọc [điều khoản Gemini API](https://ai.google.dev/gemini-api/terms) và thông tin xử lý dữ liệu của Google trước khi dùng.

Ứng dụng Windows lưu key trong Windows Credential Manager. Trong chế độ chạy trình duyệt để phát triển, key chỉ được giữ trong `sessionStorage` của tab hiện tại; đây không phải nơi lưu trữ bảo mật và sẽ mất khi đóng tab. Key cần thiết trong bộ nhớ của tiến trình khi gửi request và người dùng có thể thu hồi key từ Google AI Studio. Không ghi key vào log, dữ liệu từ vựng, source code hoặc tệp cấu hình được commit.

## Cấu trúc hiện tại

```text
frontend/src/ai/
├── contracts.ts                   # Hợp đồng provider và yêu cầu AI dùng chung
├── providerRegistry.ts             # Đăng ký adapter và provider mặc định
├── aiSettings.ts                   # Đọc/lưu/xóa key qua Tauri, browser fallback
├── aiService.ts                    # Điểm vào cho UI
├── providers/
│   └── gemini.provider.ts          # HTTP, timeout và chuyển đổi JSON Schema cho Gemini
└── features/
    └── word-suggestions.ts         # Prompt, schema, kiểm tra và chuẩn hóa gợi ý từ

frontend/src-tauri/src/lib.rs       # Tauri commands và Windows Credential Manager
frontend/src/services/vocabularyStore.ts  # Cầu nối tương thích với biểu mẫu từ hiện tại
```

## Luồng xử lý

```text
Biểu mẫu từ → vocabularyStore.suggestWord
  → aiService → feature word-suggestions
  → providerRegistry → GeminiProvider
  → Gemini API → kiểm tra/chuẩn hóa kết quả
  → điền bản nháp vào biểu mẫu → người dùng xem lại và lưu
```

Provider chỉ lo giao tiếp với model và định dạng giao thức. Tác vụ `word-suggestions` sở hữu prompt, schema đầu ra và validator nghiệp vụ. Phản hồi bên ngoài luôn được xem là không đáng tin cậy và được kiểm tra trước khi đưa vào biểu mẫu. AI không tự lưu dữ liệu.

## Thêm hoặc thay provider

`AiProvider` trong `contracts.ts` cung cấp `testConnection` và `generateStructured`; nó không có hàm riêng cho từ vựng. Khi tích hợp provider mới:

1. Tạo adapter trong `providers/`, hiện thực `AiProvider`.
2. Chuyển cấu trúc schema dùng chung sang định dạng yêu cầu của provider đó, xử lý timeout, lỗi xác thực, hạn mức và dữ liệu lỗi.
3. Đăng ký adapter trong `providerRegistry.ts` và cập nhật lựa chọn provider trong cấu hình AI.
4. Giữ prompt, schema đầu ra và validator theo từng tính năng trong `features/`.
5. Cập nhật phần chọn provider, lưu key riêng theo provider (nếu cần) và hướng dẫn UI.

Để dùng dịch vụ backend do Lexicon vận hành hoặc mô hình chạy cục bộ sau này, thêm adapter thực thi cùng hợp đồng. Tính năng và biểu mẫu không cần gọi API provider trực tiếp. Mỗi tác vụ khác (ví dụ tạo câu hỏi ôn tập) nên có feature riêng với input, prompt, schema và validator riêng; không đưa prompt tùy ý vào provider registry.

## Bảo trì và giới hạn

- Khi đổi `WordSuggestion`, cập nhật schema, validator, kiểu `WordSuggestion` ở `vocabularyStore.ts`, ánh xạ trong biểu mẫu và tài liệu này.
- Giữ provider secrets ngoài log và không lưu prompt/đầu ra nếu chưa có yêu cầu sản phẩm rõ ràng.
- BYOK không có nghĩa API key được bảo vệ khỏi chính thiết bị đang sử dụng: người dùng tự sở hữu và chịu trách nhiệm quota/billing của key. Hướng dẫn cần nhắc giới hạn quota, thu hồi key và quyền riêng tư.
- Key người dùng không được gửi tới backend Lexicon trong luồng Gemini hiện tại. Nếu sau này chuyển sang backend do Lexicon vận hành, hãy dùng xác thực, giới hạn tốc độ, quản lý bí mật server-side và cơ chế kiểm soát chi phí.
- API và gói miễn phí thay đổi theo provider; không hứa quota hay chi phí bằng 0 trong UI/tài liệu.

Backend Nest cũ trong `backend/src/ai/` hiện là adapter server-side OpenAI riêng, không nằm trên luồng BYOK của giao diện hiện tại. Có thể giữ adapter này làm phương án triển khai server sau này, nhưng cần đồng bộ hợp đồng và tính năng trước khi nối lại.
