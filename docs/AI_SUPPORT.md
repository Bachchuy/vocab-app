# AI support trong Lexicon

Tài liệu này mô tả kiến trúc AI hiện tại và cách mở rộng nó. Mục tiêu trước mắt là hỗ trợ điền các trường của một từ vựng. Về sau, Lexicon có thể thêm các tác vụ AI khác như tạo câu hỏi ôn tập hoặc giải thích đáp án mà không biến một service thành nơi chứa mọi prompt và quy tắc nghiệp vụ.

## Nguyên tắc thiết kế

- Frontend chỉ gọi API của Lexicon. Khóa nhà cung cấp AI chỉ được đọc ở backend.
- Mỗi mục đích AI là một feature/use case riêng, có DTO, prompt, schema và kiểm tra đầu ra riêng.
- Provider là lớp tích hợp với API mô hình. Nó không biết từ vựng là gì và không quyết định dữ liệu nào hợp lệ cho một feature.
- Structured output giúp định hình phản hồi, nhưng backend vẫn phải kiểm tra dữ liệu trước khi trả cho frontend.
- AI chỉ gợi ý nội dung. Người học xem lại và chỉnh sửa; việc lưu từ vẫn đi qua luồng lưu từ hiện có.
- Không xây một endpoint nhận prompt tuỳ ý từ frontend. Backend phải sở hữu prompt, schema, quyền gọi và giới hạn cho từng tác vụ.

## Cấu trúc mã nguồn

```text
backend/src/ai/
├── ai.controller.ts
├── ai.module.ts
├── contracts/
│   └── ai-provider.ts
├── providers/
│   └── openai-responses.provider.ts
└── features/
    └── word-suggestions/
        ├── suggest-word.dto.ts
        ├── suggest-word.use-case.ts
        ├── word-suggestion.prompt.ts
        ├── word-suggestion.schema.ts
        └── word-suggestion.validator.ts
```

**Vai trò các phần:**

| Phần | Trách nhiệm |
| --- | --- |
| `ai.controller.ts` | Nhận HTTP request và chuyển đến use case. |
| `contracts/ai-provider.ts` | Khai báo hợp đồng provider độc lập với nhà cung cấp cụ thể. |
| `providers/openai-responses.provider.ts` | Gọi Responses API, áp dụng timeout và chuyển lỗi nhà cung cấp thành lỗi API phù hợp. |
| `features/<feature>/*.dto.ts` | Kiểm tra input đến từ client. |
| `*.prompt.ts` | Hướng dẫn riêng của feature. |
| `*.schema.ts` | Cấu trúc đầu ra được yêu cầu từ mô hình. |
| `*.validator.ts` | Kiểm tra lại đầu ra không đáng tin cậy và chuẩn hoá dữ liệu. |
| `*.use-case.ts` | Điều phối một hành động nghiệp vụ, ghép input, prompt, schema và validator. |

## Luồng gợi ý điền từ

```text
Form từ vựng React
  → POST /ai/suggest
  → AiController
  → SuggestWordUseCase
      → OpenAiResponsesProvider
      → validateWordSuggestion
  → JSON gợi ý về frontend
  → người học sửa nếu cần
  → thao tác Lưu từ gọi luồng lưu từ hiện có
```

Frontend hiện gọi API qua `suggestWord` trong `frontend/src/services/vocabularyStore.ts`. Hàm `requestSuggestion` trong `frontend/src/App.tsx` ghép các trường gợi ý vào form. Nó không lưu tự động. Route `/ai/suggest` được giữ nguyên để frontend hiện tại tiếp tục hoạt động.

Request hiện tại:

```json
{
  "english": "acquire",
  "meaning": "",
  "source": "The company acquired a smaller competitor."
}
```

Phản hồi có các trường `meaning`, `example`, `partOfSpeech`, `pronunciation`, `wordForms`, `synonyms`, `antonyms`, `collocations` và `toeicContext`. Các giới hạn đầu ra được giữ tương thích với DTO lưu từ để gợi ý không làm form mắc lỗi độ dài khi người học lưu.

## Cách thêm một mục đích AI mới

Ví dụ thêm giải thích đáp án:

1. Tạo thư mục `backend/src/ai/features/answer-explanations/`.
2. Định nghĩa DTO cho input cụ thể; đặt giới hạn độ dài và kiểu dữ liệu.
3. Viết prompt trong `answer-explanation.prompt.ts`. Xem input của client là dữ liệu, không phải chỉ thị để thay prompt.
4. Định nghĩa schema phản hồi trong `answer-explanation.schema.ts`.
5. Viết validator riêng để xác nhận mọi trường, giới hạn độ dài, số lượng và giá trị hợp lệ.
6. Tạo `ExplainAnswerUseCase`, inject `AI_PROVIDER`, gọi `generateStructured`, rồi chạy validator.
7. Đăng ký use case trong `AiModule` và thêm route controller có tên theo hành động, ví dụ `POST /ai/explain-answer`.
8. Viết client service và giao diện riêng; không dùng endpoint gợi ý từ vựng cho tác vụ khác.

Tác vụ mới tái sử dụng provider và xử lý lỗi mạng chung, nhưng giữ prompt, input contract và output contract riêng. Khi cần đổi nhà cung cấp, tạo adapter mới thực thi `AiProvider` rồi thay binding `AI_PROVIDER` trong module. Feature/use case không cần biết request được gửi đến OpenAI hay nhà cung cấp khác.

Không tạo abstraction tổng quát hơn nếu chưa có nhu cầu thực: ví dụ không cần workflow engine, agent framework, prompt database hay hệ thống plugin để chỉ thêm một tác vụ có input/output rõ ràng.

## Cấu hình chạy

Trong `backend/.env`:

```dotenv
OPENAI_API_KEY=your-server-side-key
OPENAI_MODEL=gpt-5-mini
```

`OPENAI_API_KEY` không được đặt trong biến `VITE_*`, mã frontend, Tauri bundle hay trả về trong API. `.env.example` chỉ là mẫu và không chứa khóa thật. Backend mặc định gọi Responses API, yêu cầu JSON Schema strict, timeout sau 45 giây và đặt `store: false`. Có thể đổi model bằng `OPENAI_MODEL` mà không sửa use case.

## Lỗi và giới hạn hiện tại

- Input được validate bởi global `ValidationPipe` và DTO của feature.
- Phản hồi mô hình được kiểm tra lại tại backend trước khi gửi cho trình duyệt.
- Lỗi xác thực khóa, giới hạn tốc độ/hạn mức, timeout, lỗi HTTP và phản hồi không hợp lệ được chuyển thành lỗi API; chi tiết nội bộ của nhà cung cấp không được gửi cho client.
- Frontend hiển thị lỗi và cho phép thử lại. Lỗi AI không làm mất dữ liệu đã nhập trong form.
- Endpoint AI hiện chưa có xác thực người dùng hoặc rate limit theo client. Trước khi công khai backend trên Internet, cần thêm authentication/authorization và rate limiting phía server để kiểm soát chi phí. Không xem CORS là cơ chế bảo vệ API.
- Nội dung AI có thể sai. Người học cần kiểm tra nghĩa, IPA, ví dụ và quan hệ từ trước khi sử dụng.

## Hướng dẫn bảo trì

Khi đổi hợp đồng đầu ra, cập nhật cùng lúc schema, validator, kiểu phản hồi frontend (`WordSuggestion`), thao tác điền form và tài liệu API. Khi đổi độ dài trường, kiểm tra DTO tạo/cập nhật từ ở `backend/src/words/dto/` để giữ tương thích. Không để client nhận nguyên phản hồi thô của provider.

Các thay đổi ở `txt/` là bản hướng dẫn/source tham khảo dạng `.txt`; mã chạy của backend và frontend nằm trong `backend/src/` và `frontend/src/`.
