HƯỚNG DẪN THƯ MỤC: frontend/src/ai

Thư mục này chứa AI client theo hướng tách feature khỏi nhà cung cấp.

LUỒNG GỢI Ý TỪ
--------------
Form từ -> services/vocabularyStore.suggestWord()
-> aiService -> features/word-suggestions
-> providerRegistry -> providers/gemini.provider
-> Gemini API -> kiểm tra phản hồi -> trả bản nháp về form.

VAI TRÒ CÁC FILE
----------------
- contracts.ts: hợp đồng không phụ thuộc giao thức của từng hãng.
- providerRegistry.ts: danh sách adapter và provider đang mặc định.
- aiSettings.ts: đọc/ghi/xóa key; Tauri dùng Windows Credential Manager, browser dev dùng sessionStorage.
- aiService.ts: điểm vào cho màn hình cài đặt và các service.
- providers/gemini.provider.ts: HTTP, timeout, lỗi nhà cung cấp và parse JSON.
- features/word-suggestions.ts: prompt, schema và kiểm tra dữ liệu nghiệp vụ.

NGUYÊN TẮC MỞ RỘNG
------------------
- Không gọi API Gemini từ React component.
- Mỗi tác vụ mới có input/prompt/schema/validator riêng trong features/.
- Provider chỉ xử lý giao thức. Nếu đổi provider, feature không nên phụ thuộc JSON riêng của nhà cung cấp.
- Phản hồi model là input ngoài: validate trước khi hiển thị, và để người dùng xem lại trước khi lưu.

Tài liệu đầy đủ: docs/ai/AI_SUPPORT.md và docs/ai/WORD_SUGGESTIONS.md.
