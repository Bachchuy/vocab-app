# Lexicon

Lexicon là từ điển cá nhân để lưu từ, ngữ cảnh và nguồn bắt gặp, sau đó ôn tập theo lịch. Ứng dụng có giao diện React/Vite, vỏ desktop Tauri với SQLite cục bộ, cùng backend NestJS/Prisma cho luồng browser.

## Bắt đầu

- Muốn hiểu mục tiêu và hướng tính năng: [Tầm nhìn sản phẩm](docs/product/PRODUCT_STRATEGY_VISION.md).
- Muốn chạy ứng dụng hoặc tạo bộ cài Windows: [Khởi động nhanh](docs/desktop/V1_QUICKSTART.txt).
- Muốn biết giới hạn và kiến trúc hai chế độ web/desktop: [Hướng dẫn desktop](docs/desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt).
- Muốn phát triển AI: [Hướng dẫn AI](docs/ai/AI_SUPPORT.md).

Xem [mục lục tài liệu](docs/README.md) để chọn hướng đọc theo vai trò.

## Build nhanh

```powershell
Push-Location frontend
npm install
npm run build
Pop-Location

Push-Location backend
npm install
npm run build
Pop-Location
```

Tạo bộ cài Windows từ thư mục `frontend` bằng `npm run desktop:installer`.

## Trạng thái hiện tại

- Desktop dùng Tauri và SQLite cục bộ; web dùng backend NestJS/Prisma.
- Dữ liệu desktop và web chưa tự đồng bộ.
- Gợi ý từ bằng AI là tùy chọn; cần API key Gemini của người dùng.
- Bộ test tự động riêng chưa được thiết lập đầy đủ; build không thay thế kiểm thử hành vi trên Windows.

Các trạng thái và hướng phát triển chi tiết nằm trong tài liệu có phân nhóm dưới `docs/`.
