# ROADMAP XÂY VOCABULARY LEARNING APP
## Vừa học IT — vừa code — vừa dùng AI làm mentor

---

## 0. Mục tiêu cuối cùng

Xây một nền tảng học từ vựng đa ngôn ngữ, bắt đầu từ tiếng Anh và có khả năng mở rộng sang tiếng Trung, Nhật...

Sản phẩm cuối hướng tới:

- Vocabulary management
- Flashcard
- Quiz
- Spaced repetition
- Learning statistics
- Authentication
- AI vocabulary generation
- AI quiz generation
- AI explanation / tutor
- Personalized learning
- Semantic search / embeddings
- Multi-language
- Testing
- Docker
- CI/CD
- Deployment

Mục tiêu nghề nghiệp của project:

> Không chỉ biết framework, mà biết cách thiết kế, xây dựng, kiểm thử và triển khai một hệ thống phần mềm hoàn chỉnh.

---

# 1. Nguyên tắc học

## 1.1. Project là giáo trình

Không học hết công nghệ rồi mới làm project.

Luồng học:

```text
Feature cần làm
    ↓
Xác định kiến thức cần học
    ↓
Học concept
    ↓
Tự code
    ↓
Debug
    ↓
AI review
    ↓
Test
    ↓
Commit
```

## 1.2. AI không phải máy viết code thay bạn

Phân bổ khuyến nghị:

```text
Bạn: 80%
AI: 20%
```

AI đóng vai:

- Teacher
- Pair programmer
- Debugger
- Code reviewer
- Architecture reviewer
- Research assistant

Không dùng AI theo kiểu:

```text
"Build the entire app for me."
```

Mà dùng:

```text
"Tôi đang làm X. Đây là code của tôi.
Hãy chỉ ra vấn đề, giải thích nguyên nhân,
và cho tôi hints trước khi đưa solution."
```

## 1.3. Mỗi feature phải có Definition of Done

```text
[ ] Hiểu requirement
[ ] Hiểu concept liên quan
[ ] Tự code được
[ ] Có edge cases
[ ] Có error handling nếu cần
[ ] TypeScript không có lỗi
[ ] Test phù hợp
[ ] AI review
[ ] Sửa các vấn đề quan trọng
[ ] Git commit
[ ] Ghi lại bài học
```

---

# 2. Công nghệ sử dụng

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- TanStack Query (sau khi có backend)

## Backend

- Node.js
- TypeScript
- NestJS

## Database

- PostgreSQL
- Prisma

## DevOps

- Git
- GitHub
- Docker
- GitHub Actions

## AI

- LLM API
- Structured output
- Embeddings
- Semantic search
- Recommendation / personalization

---

# 3. Kiến trúc tổng thể

Phiên bản đầu:

```text
                USER
                  ↓
        ┌──────────────────┐
        │     FRONTEND     │
        │ React + TS       │
        └────────┬─────────┘
                 │ HTTP / JSON
                 ↓
        ┌──────────────────┐
        │     BACKEND      │
        │ NestJS + TS      │
        └───────┬───┬──────┘
                │   │
         ┌──────┘   └────────┐
         ↓                   ↓
 ┌───────────────┐    ┌───────────────┐
 │  PostgreSQL   │    │    AI API     │
 │               │    │     LLM       │
 └───────────────┘    └───────────────┘
```

Kiến trúc backend sử dụng Modular Monolith:

```text
backend/src/
├── auth/
├── users/
├── words/
├── decks/
├── reviews/
├── quiz/
├── ai/
├── common/
└── main.ts
```

Bên trong một module có thể có:

```text
words/
├── dto/
├── words.controller.ts
├── words.service.ts
└── words.repository.ts
```

Nguyên tắc:

```text
Controller  → nhận HTTP request
DTO         → kiểm tra / mô tả input
Service     → business logic
Repository  → truy cập database
Database    → lưu dữ liệu
```

---

# 4. Cấu trúc repository tổng thể

Khi project trưởng thành:

```text
vocab-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── words/
│   │   ├── decks/
│   │   ├── reviews/
│   │   ├── quiz/
│   │   ├── ai/
│   │   ├── common/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   └── learning-log.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

Không tạo tất cả thư mục ngay từ ngày đầu. Mỗi thư mục xuất hiện khi feature cần nó.

---

# 5. MILESTONE 0 — Setup

## Mục tiêu

Dựng skeleton của project và môi trường làm việc.

## Học

- Node.js là gì
- npm là gì
- package.json
- Git cơ bản
- GitHub
- Vite
- TypeScript cơ bản
- environment variables ở mức khái niệm

## Làm

Tạo:

```text
vocab-app/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

Chỉ khởi tạo frontend ở milestone này.

## Commit đầu tiên

```text
chore: initialize project
```

## Definition of Done

```text
[ ] Frontend chạy local
[ ] Git repo hoạt động
[ ] README có mục tiêu project
[ ] Hiểu package.json
[ ] Hiểu npm install / npm run
```

## AI prompt

```text
Tôi đang bắt đầu một project React + TypeScript.

Hãy giải thích cho tôi:
1. Node.js là gì?
2. npm là gì?
3. package.json là gì?
4. Vite làm gì?
5. TypeScript đứng ở đâu trong project?

Không đưa code. Tôi muốn hiểu kiến trúc trước.
```

---

# 6. MILESTONE 1 — Vocabulary List

## Mục tiêu

Hiển thị danh sách từ bằng React.

## Học

- JSX
- Component
- Props
- TypeScript interface / type
- Array.map()
- Basic CSS / Tailwind

## Thư mục

```text
frontend/src/
├── components/
│   └── WordCard.tsx
├── pages/
│   └── VocabularyPage.tsx
├── data/
│   └── words.ts
└── types/
    └── word.ts
```

## Type dữ liệu đầu tiên

```ts
export interface Word {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  level: string;
}
```

## Mock data

```text
abandon
allocate
acquire
maintain
```

## UI

```text
Vocabulary
────────────────────

abandon
To leave completely

allocate
To give something for a purpose
```

## Kiến thức phải hiểu

- Component là gì?
- Props là gì?
- Vì sao list cần key?
- `map()` làm gì?
- TypeScript bảo vệ code thế nào?

## AI prompt

```text
Tôi đang làm WordCard bằng React + TypeScript.

Đừng viết code.
Hãy đặt cho tôi 5 câu hỏi để kiểm tra tôi có hiểu:
- component
- props
- types
- rendering list
- key
```

## Done khi

```text
[ ] Có WordCard
[ ] Có VocabularyPage
[ ] Dữ liệu nằm riêng trong data/
[ ] Type Word nằm riêng trong types/
[ ] Hiểu toàn bộ code mình viết
```

---

# 7. MILESTONE 2 — Search + Filter

## Mục tiêu

Người dùng tìm được từ cần học.

## Học

- `useState`
- controlled input
- event handler
- `filter()`
- derived state
- conditional rendering

## UI

```text
Search: [____________]

Level:
[All] [A1] [A2] [B1] [B2] [C1]
```

## Bài tập

Tìm theo:

- từ tiếng Anh
- nghĩa
- level

## Câu hỏi phải tự trả lời

> Có nên lưu `filteredWords` vào state không?

Mục tiêu là hiểu khái niệm **derived data**.

## AI prompt

```text
Tôi muốn làm search vocabulary bằng React.

Đừng viết solution.
Hãy giải thích:
- state nào cần thiết
- data nào là derived state
- vì sao không nên duplicate state nếu không cần
```

## Done khi

```text
[ ] Search hoạt động
[ ] Filter level hoạt động
[ ] Input rỗng vẫn an toàn
[ ] Không có state dư thừa
```

---

# 8. MILESTONE 3 — Flashcard

## Mục tiêu

Tạo chế độ học từ.

## Học

- `useState`
- event handler
- conditional rendering
- array index
- state transition

## UI

```text
┌──────────────────────┐
│       abandon        │
│                      │
│    Show Answer       │
└──────────────────────┘
```

Sau khi click:

```text
┌──────────────────────┐
│       abandon        │
│                      │
│  to leave completely │
│                      │
│       Next →         │
└──────────────────────┘
```

## Thêm

- Previous
- Next
- Shuffle
- progress: `3 / 20`

## Edge cases

```text
index < 0
index >= words.length
words.length === 0
```

## AI prompt

```text
Tôi đã tự code Flashcard.

Hãy review logic của tôi như senior React developer.
Chỉ ra:
1. bug
2. state design problem
3. edge cases
4. unnecessary complexity

Không rewrite toàn bộ code.
```

## Done khi

```text
[ ] Show answer
[ ] Next / Previous
[ ] Shuffle
[ ] Progress
[ ] Edge cases được xử lý
```

---

# 9. MILESTONE 4 — Quiz

## Mục tiêu

Tạo bài trắc nghiệm.

## Học

- state management
- event handling
- derived values
- score calculation
- randomization

## UI

```text
Question 4 / 10

allocate means:

○ abandon
○ distribute
○ acquire
○ destroy
```

## State

```text
currentQuestion
selectedAnswer
score
finished
```

## Bài tập

Tự xây:

- 10 câu
- random option
- chọn đáp án
- khóa câu sau khi trả lời
- hiển thị đúng / sai
- tổng điểm cuối bài

## Done khi

```text
[ ] Quiz chạy end-to-end
[ ] Score đúng
[ ] Không cho trả lời hai lần
[ ] Có màn hình kết quả
```

---

# 10. MILESTONE 5 — Statistics v0

## Mục tiêu

Biến dữ liệu quiz thành thông tin hữu ích.

## Học

- `reduce()`
- basic statistics
- derived data
- formatting

## Dashboard

```text
Words studied: 50
Correct: 42
Wrong: 8
Accuracy: 84%
```

## Công thức

```text
accuracy = correct / total * 100
```

## Mở rộng

Theo topic:

```text
Technology   92%
Business     81%
Daily Life   95%
```

## Câu hỏi

> Dữ liệu thống kê nên được lưu hay tính lại từ dữ liệu gốc?

Hãy tranh luận với AI và tự quyết định.

---

# 11. MILESTONE 6 — Frontend Architecture

Chỉ làm khi component bắt đầu nhiều lên.

## Học

- component composition
- custom hooks
- service layer
- feature-oriented structure
- routing
- React Router
- state organization

## Cấu trúc dần chuyển thành

```text
frontend/src/
├── components/
├── pages/
├── features/
├── hooks/
├── services/
├── types/
├── utils/
└── data/
```

## Bài tập

Refactor mà không thay đổi behavior.

Ví dụ:

```text
FlashcardPage
    ↓
useFlashcard()
    ↓
Flashcard
```

Mục tiêu là học **refactoring**, không phải tạo abstraction cho vui.

---

# 12. MILESTONE 7 — HTTP và REST API

Bây giờ mới bước sang backend.

## Học

- HTTP
- request / response
- method
- headers
- body
- query
- params
- JSON
- status code
- REST

## Phải hiểu

```text
GET     đọc
POST    tạo
PATCH   cập nhật một phần
DELETE  xóa
```

Status code:

```text
200
201
400
401
403
404
409
500
```

## Bài tập

Trước database, backend lưu dữ liệu tạm trong memory.

API:

```text
GET    /words
GET    /words/:id
POST   /words
PATCH  /words/:id
DELETE /words/:id
```

---

# 13. MILESTONE 8 — NestJS

## Mục tiêu

Xây backend có cấu trúc.

## Học

- module
- controller
- provider
- dependency injection
- service
- DTO
- validation
- exception

## Cấu trúc

```text
backend/src/
└── words/
    ├── dto/
    │   ├── create-word.dto.ts
    │   └── update-word.dto.ts
    ├── words.controller.ts
    ├── words.service.ts
    └── words.repository.ts
```

## Request flow

```text
HTTP request
    ↓
Controller
    ↓
DTO validation
    ↓
Service
    ↓
Repository
    ↓
Response
```

## Câu hỏi phải hiểu

- Controller khác Service thế nào?
- Business logic đặt ở đâu?
- Tại sao không viết SQL trong Controller?
- DTO có tác dụng gì?

---

# 14. MILESTONE 9 — SQL + PostgreSQL

## Học SQL

```text
SELECT
INSERT
UPDATE
DELETE
WHERE
ORDER BY
LIMIT
JOIN
GROUP BY
HAVING
COUNT
AVG
SUM
```

Sau đó:

- primary key
- foreign key
- unique
- index
- transaction
- normalization

## Database version 1

```text
users
languages
words
meanings
examples
decks
user_words
reviews
```

## Tư duy domain

`user_words` = trạng thái hiện tại của user với một từ.

`reviews` = lịch sử những lần review.

Ví dụ:

```text
user_words
---------
user_id
word_id
stability
difficulty
next_review
```

```text
reviews
-------
user_id
word_id
rating
reviewed_at
```

---

# 15. MILESTONE 10 — Prisma

## Học

- schema
- model
- relation
- migration
- query
- transaction

## Nguyên tắc

Không dùng Prisma để trốn SQL.

Phải hiểu SQL mà Prisma đại diện cho.

## Bài tập

Viết database bằng Prisma, sau đó viết / đọc SQL tương đương ở mức cơ bản.

---

# 16. MILESTONE 11 — Kết nối Frontend ↔ Backend

Bây giờ bỏ mock data.

Luồng:

```text
React
  ↓
HTTP
  ↓
NestJS
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Frontend dùng service layer:

```text
services/
├── wordService.ts
├── quizService.ts
└── reviewService.ts
```

Sau khi dữ liệu chạy thật, học tiếp:

- loading state
- error state
- caching
- TanStack Query

---

# 17. MILESTONE 12 — Authentication

## Học

- password hashing
- authentication
- authorization
- JWT
- access token
- refresh token
- guard
- CORS
- cookie / storage considerations

## Backend

```text
auth/
├── dto/
├── auth.controller.ts
├── auth.service.ts
└── auth.guard.ts
```

## Flow

```text
Register
  ↓
hash password
  ↓
Database

Login
  ↓
verify password
  ↓
issue token
```

## Security rule

Không bao giờ lưu plain-text password.

---

# 18. MILESTONE 13 — Spaced Repetition

Đây là core algorithm của app.

## Version 1: tự thiết kế

```text
Again → 10 phút
Hard  → 1 ngày
Good  → 3 ngày
Easy  → 7 ngày
```

## Dữ liệu

```text
state
difficulty
stability
last_review
next_review
correct_count
wrong_count
```

## Học

- scheduling
- date/time
- state transition
- algorithm design
- edge cases
- testing

## Sau khi bản đơn giản chạy ổn

Nghiên cứu:

- forgetting curve
- SM-2
- FSRS
- retrievability
- memory stability

Không copy algorithm ngay. Tự xây bản đơn giản rồi mới so sánh.

---

# 19. MILESTONE 14 — Review History + Analytics

## Metrics

```text
words learned
reviews today
accuracy
retention
streak
response time
weak topics
strong topics
```

## Học

- aggregation
- statistics
- data modeling
- analytical queries

## Bài tập

Tạo dashboard:

```text
Today
------
32 reviews
87% accuracy
12 new words
24 due reviews
14 day streak
```

---

# 20. MILESTONE 15 — AI Vocabulary Generation

Chỉ thêm AI sau khi core app đã chạy.

## Feature

User chọn:

```text
Topic: Software Engineering
Level: B2
Quantity: 20
Language: English
```

AI tạo từ.

## Kiến trúc

```text
React
  ↓
NestJS
  ↓
AIService
  ↓
LLM API
  ↓
Structured output
  ↓
Validation
  ↓
Business rules
  ↓
Database
```

Không để frontend giữ API key.

## AI output nên có schema

```json
{
  "words": [
    {
      "word": "deploy",
      "partOfSpeech": "verb",
      "definition": "...",
      "example": "...",
      "synonyms": [],
      "antonyms": []
    }
  ]
}
```

---

# 21. MILESTONE 16 — AI Quiz + AI Explanation

## Features

```text
POST /ai/generate-quiz
POST /ai/explain-answer
```

## AI Quiz

AI nhận word list → tạo câu hỏi.

## AI Explanation

User chọn sai → AI giải thích tại sao.

## Điều cần học

- prompting
- structured output
- validation
- cost control
- rate limiting
- hallucination
- prompt injection ở mức ứng dụng

---

# 22. MILESTONE 17 — AI Tutor

AI không chỉ sinh nội dung.

Nó phải biết ngữ cảnh của user:

```text
User level
Weak words
Review history
Topics
Recent mistakes
```

Flow:

```text
User context
    ↓
Backend
    ↓
Prompt/context construction
    ↓
LLM
    ↓
Tutor response
```

Mục tiêu:

> AI hiểu người học đang yếu ở đâu và giải thích phù hợp.

---

# 23. MILESTONE 18 — Semantic Search

Search truyền thống:

```text
computer
```

→ match keyword.

Semantic search:

```text
computer
```

→ có thể tìm các khái niệm liên quan về computing / machine / PC.

## Học

- embeddings
- cosine similarity
- vector search
- retrieval

Kiến trúc:

```text
User query
   ↓
Embedding
   ↓
Vector search
   ↓
Relevant words
```

---

# 24. MILESTONE 19 — Personalized Recommendation

Mục tiêu:

> Hệ thống quyết định user nên học gì tiếp theo.

## Version 1

Rule-based:

```text
high wrong rate
×
high difficulty
×
long time since review
```

→ priority cao.

## Version 2

Recommendation algorithm.

## Version 3

Machine learning nếu thực sự cần.

Không dùng ML chỉ để làm cho project "ngầu".

---

# 25. MILESTONE 20 — Multi-language

Thiết kế dữ liệu language-neutral.

Ví dụ:

```text
languages
---------
en | English
zh | Chinese
vi | Vietnamese
ja | Japanese
```

`words` không chứa `english_word`.

Mà:

```text
words
-----
id
language_id
text
pronunciation
```

Nhờ vậy có thể mở rộng:

```text
English
Chinese
Japanese
Korean
...
```

Các tính năng có thể thêm sau:

- pinyin
- tone
- characters
- pronunciation audio
- transliteration

---

# 26. MILESTONE 21 — Testing

## Unit test

Test:

```text
calculateNextReview()
calculateAccuracy()
shuffleQuizOptions()
```

## Integration test

```text
POST /words
GET /words
POST /reviews
```

## E2E

```text
register
→ login
→ create deck
→ add word
→ review
→ see statistics
```

## Nguyên tắc

Test business logic quan trọng trước.

---

# 27. MILESTONE 22 — Docker

Khi app ổn:

```text
docker-compose.yml

services:
  frontend
  backend
  postgres
```

Mục tiêu:

```bash
docker compose up
```

là hệ thống chạy được.

Học:

- image
- container
- volume
- network
- environment variables

---

# 28. MILESTONE 23 — CI/CD + Deployment

Flow:

```text
GitHub
  ↓
Push
  ↓
CI
  ↓
Test
  ↓
Build
  ↓
Deploy
```

Học:

- production build
- secrets
- environment variables
- migration production
- logs
- monitoring
- rollback

---

# 29. Sau này mới nghĩ tới Redis / Queue / Worker

Không thêm quá sớm.

Chỉ thêm khi có workload phù hợp.

Ví dụ AI generation hàng loạt:

```text
API
 ↓
Queue
 ↓
Worker
 ↓
AI
 ↓
Database
```

Redis có thể dùng cho:

- cache
- queue
- rate limiting
- temporary state

---

# 30. Khi nào cân nhắc microservices?

Không dùng ngay.

Tiến hóa:

```text
Modular Monolith
    ↓
Caching
    ↓
Queue / Worker
    ↓
Scale
    ↓
Tách service nếu có lý do thật
```

Không tách service chỉ vì microservices "xịn".

---

# 31. Các câu hỏi Architecture phải luôn tự hỏi

Với mỗi feature:

1. Logic này thuộc frontend hay backend?
2. Đây là UI logic hay business logic?
3. Dữ liệu này thuộc entity nào?
4. Có cần lưu vào database không?
5. API contract là gì?
6. Nếu user gửi dữ liệu sai thì sao?
7. Nếu request thất bại thì sao?
8. Nếu có 100x traffic thì sao?
9. AI có thể trả dữ liệu sai ở đâu?
10. Có thể test logic này độc lập không?

---

# 32. Quy tắc AI Mentor

## Khi chưa hiểu

```text
Giải thích concept trước.
Không đưa code.
```

## Khi đang code

```text
Cho hints trước.
```

## Khi debug

```text
Tìm nhóm nguyên nhân.
Đừng đưa full solution ngay.
```

## Khi code xong

```text
Review như senior engineer.
```

## Sau review

```text
Cho edge cases.
```

## Khi học architecture

```text
Cho tôi trade-offs.
```

---

# 33. Prompt template dùng hằng ngày

## Học concept

```text
Tôi đang xây vocabulary learning app bằng React + TypeScript.

Tôi cần học [CONCEPT].

Hãy giải thích:
1. Bản chất
2. Vì sao tồn tại
3. Khi nào dùng
4. Khi nào không dùng
5. Ví dụ liên quan trực tiếp đến project của tôi

Không đưa solution hoàn chỉnh.
```

## Cho bài tập

```text
Hãy ra cho tôi một bài tập về [CONCEPT]
liên quan đến vocabulary app.

Không đưa đáp án.
Chỉ đưa hints nếu tôi hỏi.
```

## Review code

```text
Review đoạn code sau như senior software engineer.

Đánh giá:
- correctness
- readability
- architecture
- TypeScript
- performance
- security
- maintainability

Không rewrite toàn bộ.
```

## Debug

```text
Tôi gặp lỗi sau:
[ERROR]

Đây là code liên quan:
[CODE]

Tôi đã thử:
[ATTEMPTS]

Hãy giúp tôi debug theo kiểu mentoring:
1. Xác định nhóm nguyên nhân
2. Cho hints
3. Chỉ ra thứ cần kiểm tra
4. Chỉ đưa solution hoàn chỉnh nếu tôi yêu cầu
```

## Architecture review

```text
Tôi muốn thêm feature [X].

Current architecture:
[ARCHITECTURE]

Hãy đề xuất:
- module nào cần thêm
- database changes
- API changes
- business logic
- trade-offs
- edge cases

Ưu tiên kiến trúc đơn giản và có khả năng mở rộng.
```

---

# 34. Lịch học gợi ý mỗi buổi

Một buổi 2–3 giờ:

```text
30 phút  → học concept
60–90 phút → code
20 phút → debug / AI review
20 phút → test / edge cases
10 phút → commit + learning log
```

Mỗi buổi nên có **một output chạy được**.

---

# 35. Learning Log

Trong `docs/learning-log.md`, mỗi session ghi:

```text
Date:
Feature:
Concept learned:
What I implemented:
Bug I met:
How I fixed it:
What AI helped with:
What I still don't understand:
Next step:
```

Mục đích là biến GitHub repo thành nhật ký tiến bộ kỹ thuật.

---

# 36. Git workflow

Branch đơn giản:

```text
main
└── feature/xxx
```

Commit examples:

```text
feat: add vocabulary list
feat: implement vocabulary search
feat: add flashcard navigation
feat: implement quiz scoring
fix: prevent duplicate review submission
refactor: extract flashcard hook
test: add review algorithm tests
docs: add database design
```

Không dùng commit kiểu:

```text
update
final
final2
abc
```

---

# 37. MVP 1 — Điều kiện hoàn thành

MVP 1 không có backend.

```text
[ ] Vocabulary list
[ ] Search
[ ] Filter
[ ] Flashcard
[ ] Next / Previous
[ ] Quiz
[ ] Score
[ ] Statistics
```

Stack:

```text
React
TypeScript
Vite
Tailwind
```

---

# 38. MVP 2 — Backend

```text
[ ] REST API
[ ] NestJS
[ ] PostgreSQL
[ ] Prisma
[ ] CRUD vocabulary
[ ] Frontend gọi API thật
```

---

# 39. MVP 3 — User system

```text
[ ] Register
[ ] Login
[ ] Authentication
[ ] Authorization
[ ] User-specific decks
[ ] User-specific reviews
```

---

# 40. MVP 4 — Learning engine

```text
[ ] Review state
[ ] Spaced repetition
[ ] Due reviews
[ ] Review history
[ ] Learning statistics
```

---

# 41. MVP 5 — AI

```text
[ ] Generate vocabulary
[ ] Generate example
[ ] Generate quiz
[ ] Explain mistakes
[ ] AI tutor
```

---

# 42. MVP 6 — Advanced

```text
[ ] Semantic search
[ ] Recommendation
[ ] Multi-language
[ ] Chinese support
[ ] Pronunciation
[ ] Listening
```

---

# 43. Production

```text
[ ] Tests
[ ] Docker
[ ] CI/CD
[ ] Deployment
[ ] Logging
[ ] Monitoring
[ ] Security review
[ ] Backup strategy
```

---

# 44. Thứ tự học chính xác

```text
JavaScript fundamentals
        ↓
TypeScript
        ↓
React
        ↓
HTML/CSS/HTTP fundamentals
        ↓
REST API
        ↓
Node.js
        ↓
NestJS
        ↓
SQL
        ↓
PostgreSQL
        ↓
Prisma
        ↓
Authentication
        ↓
Algorithms / Spaced Repetition
        ↓
Statistics / Analytics
        ↓
AI Integration
        ↓
Embeddings / Search
        ↓
Recommendation
        ↓
Testing
        ↓
Docker
        ↓
CI/CD / Deployment
```

---

# 45. Những thứ chưa nên học ngay

Chưa cần khi mới bắt đầu:

- Redux nếu chưa cần
- Next.js
- Microservices
- Kubernetes
- Kafka
- RabbitMQ
- Vector database riêng
- Multi-agent system
- RAG phức tạp
- ML model riêng

Mục tiêu là **giải quyết vấn đề thật**, không phải thu gom công nghệ.

---

# 46. Tiêu chuẩn trình độ sau mỗi tầng

## Sau Frontend v0

Bạn có thể:

- viết React component
- quản lý state
- render data
- xử lý form / event
- tạo một UI tương tác

## Sau Backend

Bạn hiểu:

- HTTP
- REST
- API
- controller
- service
- DTO
- validation

## Sau Database

Bạn hiểu:

- relational modeling
- SQL
- relation
- transaction
- index

## Sau Authentication

Bạn hiểu:

- authentication
- authorization
- hashing
- token
- security basics

## Sau Spaced Repetition

Bạn hiểu:

- algorithm design
- state
- scheduling
- testing
- basic statistics

## Sau AI

Bạn hiểu:

- LLM API
- structured output
- validation
- prompt design
- embeddings
- retrieval

## Sau Production

Bạn hiểu:

- Docker
- CI/CD
- deployment
- monitoring
- operational concerns

---

# 47. Việc đầu tiên phải làm

## Day 1

```text
[ ] Tạo GitHub repository vocab-app
[ ] Tạo frontend bằng Vite + React + TypeScript
[ ] Tạo docs/
[ ] Viết README.md
[ ] Tạo components/
[ ] Tạo pages/
[ ] Tạo data/
[ ] Tạo types/
[ ] Tạo Word type
[ ] Tạo mock words
[ ] Tạo WordCard
[ ] Tạo VocabularyPage
[ ] Hiển thị danh sách từ
[ ] Commit
```

Commit:

```text
feat: initialize vocabulary frontend
```

## Sau Day 1

Mới chuyển sang:

```text
Search
↓
Filter
↓
Flashcard
↓
Quiz
```

---

# 48. Mental model cuối cùng

Luôn nghĩ:

```text
USER
 ↓
FRONTEND
 ↓
API
 ↓
BACKEND
 ↓
BUSINESS LOGIC
 ↓
DATABASE / AI
 ↓
RESPONSE
 ↓
FRONTEND
```

Và ở backend:

```text
Controller
 ↓
DTO
 ↓
Service
 ↓
Repository
 ↓
Database
```

Đây là xương sống của project.

---

# 49. Triết lý của project

Đừng đặt mục tiêu:

> "Làm app càng nhanh càng tốt."

Đặt mục tiêu:

> "Mỗi feature phải giúp mình hiểu thêm một phần của software engineering."

Project này nên phát triển theo:

```text
Simple
  ↓
Working
  ↓
Understandable
  ↓
Tested
  ↓
Maintainable
  ↓
Scalable
```

Không đảo thành:

```text
Complex
  ↓
Confusing
  ↓
AI-generated
  ↓
Can't explain
```

---

# 50. Checklist tổng cuối project

```text
FOUNDATION
[ ] JavaScript
[ ] TypeScript
[ ] Git
[ ] GitHub

FRONTEND
[ ] React
[ ] Routing
[ ] State
[ ] Forms
[ ] Components
[ ] Hooks

BACKEND
[ ] Node.js
[ ] NestJS
[ ] REST API
[ ] DTO
[ ] Validation
[ ] Error handling

DATABASE
[ ] SQL
[ ] PostgreSQL
[ ] Prisma
[ ] Relations
[ ] Indexes
[ ] Transactions

SECURITY
[ ] Password hashing
[ ] Authentication
[ ] Authorization
[ ] JWT
[ ] CORS

ALGORITHM
[ ] Spaced repetition
[ ] Scheduling
[ ] Review history
[ ] Recommendation basics

AI
[ ] LLM API
[ ] Structured output
[ ] AI generation
[ ] AI explanation
[ ] AI tutor
[ ] Embeddings
[ ] Semantic search

QUALITY
[ ] Unit tests
[ ] Integration tests
[ ] E2E tests
[ ] Code review

DEVOPS
[ ] Docker
[ ] CI/CD
[ ] Deployment
[ ] Monitoring
```

---

# 51. Điểm bắt đầu của bạn

Không bắt đầu bằng AI.

Không bắt đầu bằng PostgreSQL.

Không bắt đầu bằng NestJS.

Bắt đầu bằng:

```text
Vite
↓
React + TypeScript
↓
VocabularyPage
↓
WordCard
↓
Mock data
↓
Search
↓
Filter
↓
Flashcard
↓
Quiz
```

Khi hoàn thành frontend v0, mới xây backend.

Khi backend + database chạy, mới xây authentication.

Khi review system chạy, mới xây AI.

Khi hệ thống có dữ liệu thật, mới làm personalization.

Đó là con đường để **vừa học, vừa code, vừa hiểu architecture, vừa có portfolio thật**.
