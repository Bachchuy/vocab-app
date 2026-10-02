# Git Flow cho Vocab App

Tài liệu này quy định cách tạo branch, commit và push cho project theo Git Flow.

## 1. Vai trò của các branch

```text
main       Code production, chỉ nhận release và hotfix đã được kiểm tra.
develop    Branch tích hợp cho phiên bản phát triển tiếp theo.
feature/*  Một tính năng hoặc refactor độc lập, tách từ develop.
release/*  Chuẩn bị một phiên bản phát hành, tách từ develop.
hotfix/*   Sửa lỗi production, tách từ main.
```

Quy tắc chính:

- Không commit trực tiếp vào `main` hoặc `develop`.
- `feature/*` luôn bắt đầu từ `develop`.
- `release/*` luôn bắt đầu từ `develop`.
- `hotfix/*` luôn bắt đầu từ `main`.
- Một branch chỉ nên phục vụ một mục tiêu rõ ràng.
- Không đưa file generated, secret hoặc cache build vào commit.

## 2. Bắt đầu một feature mới

Luôn cập nhật `develop` trước khi tạo branch:

```powershell
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c feature/<ten-ngan-gon>
git push -u origin feature/<ten-ngan-gon>
```

Ví dụ:

```powershell
git switch -c feature/app-refactor
git push -u origin feature/app-refactor
```

Tên branch nên dùng kebab-case và mô tả mục tiêu:

```text
feature/ai-settings
feature/review-dashboard
feature/app-refactor
feature/import-validation
```

Nếu thay đổi phụ thuộc vào một feature branch chưa merge vào `develop`, phải ghi rõ trong PR. Không tự ý tách branch con từ branch feature rồi giả vờ đó là feature độc lập từ `develop`.

## 3. Trước khi commit

Kiểm tra mình đang đứng đúng branch:

```powershell
git branch --show-current
git status --short
git diff --check
```

Kiểm tra phạm vi thay đổi:

```powershell
git diff --stat
git diff
```

Build/test theo phần bị ảnh hưởng:

```powershell
Push-Location frontend
npm run build
Pop-Location

Push-Location backend
npm run build
Pop-Location
```

Frontend và backend hiện chưa có test script riêng. Khi thêm test runner, phải chạy test liên quan trước khi mở PR.

## 4. File không được commit

Các file sau là generated/local-only:

```text
node_modules/
dist/
.env
*.tsbuildinfo
backend/data/
backend/prisma/*.db
```

Nếu một file generated đã từng được Git track, thêm rule vào `.gitignore` là chưa đủ. Cần bỏ file khỏi index nhưng giữ file local:

```powershell
git rm --cached backend/tsconfig.tsbuildinfo frontend/tsconfig.tsbuildinfo
git add .gitignore
git commit -m "chore: ignore generated TypeScript metadata"
```

Không commit API key, file `.env`, credential hoặc dữ liệu cá nhân.

## 5. Commit

Stage đúng file, không dùng `git add .` khi chưa kiểm tra diff:

```powershell
git add <file-1> <file-2>
git diff --cached --stat
git diff --cached
git commit -m "<type>(<scope>): <mô tả ngắn>"
```

Các loại commit được dùng trong project:

```text
feat      Thêm tính năng
fix       Sửa lỗi
refactor  Đổi cấu trúc nhưng giữ hành vi
docs      Cập nhật tài liệu
chore     Công việc bảo trì, config, generated-file policy
build     Thay đổi build/dependency
```

Ví dụ:

```text
feat(ai): add Gemini settings
fix(review): preserve due date after rating
refactor(frontend): split vocabulary screens
docs: add Git Flow guide
```

Mỗi commit nên có một mục tiêu. Nếu vừa sửa bug vừa refactor lớn, tách thành hai commit hoặc hai branch khi có thể.

## 6. Push và Pull Request

Sau commit:

```powershell
git push origin feature/<ten-ngan-gon>
```

Mở PR theo hướng:

```text
feature/*  -> develop
release/*  -> main và đồng bộ ngược về develop
hotfix/*   -> main và đồng bộ ngược về develop
```

PR description nên có:

- Mục tiêu thay đổi.
- Các file/module chính đã thay đổi.
- Lệnh build/test đã chạy và kết quả.
- Migration hoặc cấu hình bắt buộc nếu có.
- Rủi ro còn lại hoặc việc chưa làm.

Không merge feature branch trực tiếp vào `main`.

## 7. Release

Khi `develop` đủ ổn định để phát hành:

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c release/v1.0.0
git push -u origin release/v1.0.0
```

Chỉ sửa bug, version, changelog và tài liệu phát hành trên `release/*`. Không thêm feature mới.

Khi release pass kiểm tra:

```text
release/v1.0.0 -> main
release/v1.0.0 -> develop
```

Sau đó tạo tag trên `main`:

```powershell
git switch main
git pull --ff-only origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 8. Hotfix production

Khi cần sửa lỗi đang có trên production:

```powershell
git switch main
git pull --ff-only origin main
git switch -c hotfix/<ten-loi>
git push -u origin hotfix/<ten-loi>
```

Sau khi sửa và kiểm tra:

```text
hotfix/* -> main
hotfix/* -> develop
```

Hotfix không tách từ `develop`, vì `develop` có thể chứa code chưa được phát hành.

## 9. Quy trình chuẩn cho lần làm việc tiếp theo

```text
1. Xác định mục tiêu thay đổi.
2. Đứng trên develop và pull mới nhất.
3. Tạo feature branch từ develop.
4. Code và commit nhỏ theo một mục tiêu.
5. Chạy build/test.
6. Kiểm tra git diff và file generated.
7. Push branch.
8. Mở PR vào develop.
9. Chỉ release từ develop qua release branch.
```

Checklist trước khi push:

```text
[ ] Đang ở đúng feature/* branch
[ ] Branch được tạo từ develop hoặc có dependency được ghi rõ
[ ] Không có API key, .env hoặc database local
[ ] Không có node_modules, dist hoặc *.tsbuildinfo trong commit
[ ] Build pass
[ ] Test pass hoặc đã ghi rõ repo chưa có test runner
[ ] Commit message mô tả đúng thay đổi
[ ] PR target là develop, không phải main
```

## 10. Ngoại lệ hiện tại của repository

`feature/ai-support` và `feature/app-refactor` được tạo trong cùng đợt phát triển AI/refactor. `feature/app-refactor` phụ thuộc vào các module AI trên `feature/ai-support`, nên đây là branch phụ thuộc, không phải mẫu để tạo feature mới.

Các feature tiếp theo phải bắt đầu từ `develop`. Nếu cần làm tiếp trên app refactor, mở PR `feature/app-refactor` vào branch phù hợp trước, hoặc merge các thay đổi nền tảng vào `develop` rồi tạo feature branch mới từ đó.
