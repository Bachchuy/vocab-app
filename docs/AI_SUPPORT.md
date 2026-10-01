# Hỗ trợ AI trong Lexicon

Tài liệu này mô tả kiến trúc AI hiện tại và cách mở rộng. Mục tiêu trước mắt là hỗ trợ điền các trường của một mục từ. Về sau, Lexicon có thể thêm các tác vụ như tạo câu hỏi ôn tập hoặc giải thích đáp án mà không biến một dịch vụ thành nơi chứa tất cả prompt và quy tắc nghiệp vụ.

## Nguyên tắc thiết kế

- Giao diện chỉ gọi API của Lexicon. Khóa của nhà cung cấp AI chỉ được đọc ở backend.
- Mỗi mục đích AI là một tính năng/use case riêng, có DTO, prompt, schema và bước kiểm tra đầu ra riêng.
- Provider là lớp tích hợp với API mô hình. Provider không biết nghiệp vụ từ vựng và không quyết định dữ liệu nào hợp lệ.
- Structured output giúp định hình phản hồi, nhưng backend vẫn phải kiểm tra dữ liệu trước khi trả về giao diện.
- AI chỉ đề xuất nội dung. Người học xem lại, chỉnh sửa rồi mới lưu qua luồng lưu từ hiện có.
- Không xây endpoint nhận prompt tùy ý từ giao diện. Backend phải kiểm soát prompt, schema, quyền gọi và giới hạn của từng tác vụ.

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

## Vai trò của từng phần

| Thành phần                               | Trách nhiệm                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `ai.controller.ts`                       | Nhận yêu cầu HTTP và chuyển cho use case.                                                  |
| `contracts/ai-provider.ts`               | Khai báo hợp đồng provider, độc lập với nhà cung cấp cụ thể.                               |
| `providers/openai-responses.provider.ts` | Gọi Responses API, áp dụng thời gian chờ và chuyển lỗi nhà cung cấp thành lỗi API phù hợp. |
| `features/<feature>/*.dto.ts`            | Kiểm tra dữ liệu đầu vào từ client.                                                        |
| `*.prompt.ts`                            | Chứa hướng dẫn riêng của tính năng.                                                        |
| `*.schema.ts`                            | Mô tả cấu trúc đầu ra yêu cầu từ mô hình.                                                  |
| `*.validator.ts`                         | Kiểm tra và chuẩn hóa phản hồi không đáng tin cậy.                                         |
| `*.use-case.ts`                          | Điều phối nghiệp vụ, ghép input, prompt, schema và validator.                              |

## Luồng gợi ý điền từ

```text
Biểu mẫu từ vựng React
  → POST /ai/suggest
  → AiController
  → SuggestWordUseCase
      → OpenAiResponsesProvider
      → validateWordSuggestion
  → JSON gợi ý về giao diện
  → người học xem lại và chỉnh sửa
  → thao tác Lưu từ gọi luồng lưu hiện có
```

Giao diện gọi API qua `suggestWord` trong `frontend/src/services/vocabularyStore.ts`. Hàm `requestSuggestion` trong `frontend/src/App.tsx` đưa các trường gợi ý vào biểu mẫu. AI không tự động lưu dữ liệu. Route `/ai/suggest` được giữ nguyên để client hiện tại tiếp tục hoạt động.

## Hợp đồng yêu cầu hiện tại

```json
{
  "term": "acquire",
  "meaning": "",
  "source": "The company acquired a smaller competitor.",
  "sourceLanguage": "en",
  "explanationLanguage": "vi",
  "learningGoal": "general vocabulary"
}
```

Phản hồi có thể gồm nghĩa, câu ví dụ, CEFR, từ loại, văn phong, tần suất, phát âm, âm tiết, trọng âm, các sense, dạng từ, từ đồng nghĩa, từ trái nghĩa, collocation, mẫu ngữ pháp và ngữ cảnh. Cặp ngôn ngữ cùng `learningGoal` giúp một luồng hoạt động cho nhiều ngôn ngữ và mục tiêu học. TOEIC hoặc IELTS chỉ là giá trị mục tiêu tùy chọn.

## Cách thêm một tác vụ AI mới

Ví dụ thêm tính năng giải thích đáp án:

1. Tạo thư mục `backend/src/ai/features/answer-explanations/`.
2. Định nghĩa DTO cho dữ liệu đầu vào, kèm giới hạn độ dài và kiểu dữ liệu.
3. Viết prompt trong `answer-explanation.prompt.ts`. Xem dữ liệu từ client là dữ liệu, không phải chỉ thị thay thế prompt.
4. Định nghĩa schema phản hồi trong `answer-explanation.schema.ts`.
5. Viết validator riêng để kiểm tra trường, độ dài, số lượng và giá trị hợp lệ.
6. Tạo `ExplainAnswerUseCase`, inject `AI_PROVIDER`, gọi `generateStructured`, rồi chạy validator.
7. Đăng ký use case trong `AiModule` và thêm route theo hành động, ví dụ `POST /ai/explain-answer`.
8. Viết service client và giao diện riêng; không dùng endpoint gợi ý từ vựng cho tác vụ khác.

Tác vụ mới có thể dùng lại provider và xử lý lỗi mạng chung, nhưng phải giữ prompt, hợp đồng input và hợp đồng output riêng. Khi cần đổi nhà cung cấp, tạo adapter mới thực thi `AiProvider` rồi thay binding `AI_PROVIDER` trong module. Tính năng/use case không cần biết request được gửi đến OpenAI hay nhà cung cấp nào.

Không tạo abstraction lớn hơn nhu cầu thực tế. Chưa cần workflow engine, agent framework, cơ sở dữ liệu prompt hay hệ thống plugin chỉ để thêm một tác vụ có input/output rõ ràng.

## Cấu hình chạy

Trong `backend/.env`:

```dotenv
OPENAI_API_KEY=your-server-side-key
OPENAI_MODEL=gpt-5-mini
```

`OPENAI_API_KEY` không được đặt trong biến `VITE_*`, mã frontend, gói Tauri hoặc trả về trong API. `.env.example` chỉ là mẫu và không chứa khóa thật. Backend mặc định gọi Responses API, yêu cầu JSON Schema strict, chờ tối đa 45 giây và đặt `store: false`. Có thể đổi model bằng `OPENAI_MODEL` mà không sửa use case.

## Lỗi và giới hạn hiện tại

- Input được kiểm tra bởi `ValidationPipe` toàn cục và DTO của từng tính năng.
- Phản hồi mô hình được kiểm tra lại ở backend trước khi gửi tới trình duyệt.
- Lỗi khóa, giới hạn tốc độ/hạn mức, thời gian chờ, lỗi HTTP và phản hồi không hợp lệ được chuyển thành lỗi API; chi tiết nội bộ của nhà cung cấp không gửi cho client.
- Giao diện hiển thị lỗi và cho phép thử lại. Lỗi AI không làm mất dữ liệu người học đã nhập.
- Endpoint AI hiện chưa có xác thực người dùng hoặc giới hạn tốc độ theo client. Trước khi công khai backend trên Internet, cần thêm xác thực, phân quyền và giới hạn tốc độ ở server để kiểm soát chi phí. CORS không phải cơ chế bảo vệ API.
- Nội dung AI có thể sai. Người học cần kiểm tra nghĩa, IPA, ví dụ và quan hệ từ trước khi sử dụng.

## Hướng dẫn bảo trì

Khi đổi hợp đồng đầu ra, cập nhật đồng thời schema, validator, kiểu phản hồi frontend `WordSuggestion`, thao tác điền biểu mẫu và tài liệu API. Khi đổi giới hạn trường, kiểm tra DTO tạo/cập nhật từ trong `backend/src/words/dto/` để giữ tương thích. Không trả nguyên phản hồi thô của provider cho client.

Các thay đổi ở `txt/` là bản hướng dẫn hoặc mã nguồn tham khảo dạng `.txt`; mã chạy của backend và frontend nằm trong `backend/src/` và `frontend/src/`.
