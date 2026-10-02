HƯỚNG DẪN THƯ MỤC: frontend/src

Đây là source React/TypeScript của frontend và desktop.

Các điểm vào và nhóm file hiện tại:
- main.tsx: khởi động React.
- App.tsx: state và điều phối màn hình chính.
- app/: component, screen, kiểu form và xử lý lỗi giao diện.
- services/vocabularyStore.ts: giao tiếp dữ liệu; chọn SQLite Tauri trên desktop hoặc HTTP khi chạy browser.
- ai/: hợp đồng provider, cài đặt key, Gemini adapter và use case gợi ý từ.
- index.css: style toàn cục.

Khi sửa UI, giữ business/data logic trong service hoặc feature phù hợp thay vì gọi provider trực tiếp từ component. Xem docs/ai/AI_SUPPORT.md và docs/product/VOCABULARY_MODEL.md để hiểu các ranh giới này.
