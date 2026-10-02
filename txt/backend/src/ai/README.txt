HƯỚNG DẪN THƯ MỤC: backend/src/ai

Đây là adapter AI server-side NestJS/OpenAI cũ. Luồng này đọc key OPENAI_API_KEY từ backend và không phải luồng BYOK Gemini của giao diện desktop hiện tại.

Vai trò:
- ai.module.ts: đăng ký controller và use case.
- ai.controller.ts: API boundary.
- contracts/ai-provider.ts: hợp đồng provider phía server.
- providers/openai-responses.provider.ts: giao tiếp OpenAI Responses API.
- features/word-suggestions/: prompt, schema, validator và use case.

Không tự động nối frontend desktop vào adapter này. Nếu sản phẩm chuyển sang AI do Lexicon vận hành, cần quyết định lại xác thực, giới hạn gọi, bảo vệ chi phí và chính sách dữ liệu. Dùng docs/ai/AI_SUPPORT.md làm tài liệu hiện hành về luồng BYOK.
