# LỘ TRÌNH XÂY ỨNG DỤNG HỌC TỪ VỰNG BẰNG AI

## 0. Mục tiêu của project

Bạn không nên xem đây đơn thuần là một app flashcard.

Mục tiêu là xây một **language-learning platform có adaptive learning**, bắt đầu bằng tiếng Anh và có kiến trúc đủ tốt để mở rộng sang tiếng Trung, tiếng Nhật… sau này.

Project sẽ đồng thời giúp bạn luyện:

```text
Programming
├── TypeScript
├── React
├── Node.js
├── NestJS
├── REST API
├── PostgreSQL
├── ORM
├── Authentication
├── Testing
├── Git/GitHub
└── Docker/Deployment

Computer Science
├── Data Modeling
├── Algorithms
├── Search
├── Scheduling
├── Probability
├── Statistics
└── Recommendation

AI
├── LLM API
├── Structured output
├── Prompt engineering
├── Embeddings
├── Semantic search
└── Personalization

Software Engineering
├── Architecture
├── Clean code
├── Debugging
├── Documentation
├── CI/CD
└── Production mindset
```

Đích cuối cùng không phải:

> "Tôi đã học React."

Mà là:

> **"Tôi có thể tự thiết kế và xây dựng một sản phẩm full-stack có database, authentication, algorithm, AI và deployment."**

---

# 1. Nguyên tắc học quan trọng nhất

Bạn hãy sử dụng mô hình:

```text
HỌC → CODE → GẶP VẤN ĐỀ → NGHIÊN CỨU → SỬA → TEST → GHI LẠI
```

Không học theo kiểu:

```text
Học React 2 tháng
↓
Học Node 1 tháng
↓
Học SQL 1 tháng
↓
Cuối cùng mới làm project
```

Cách đó rất dễ rơi vào "tutorial hell".

Thay vào đó:

```text
Tôi cần trang Flashcard
        ↓
Tôi cần React state
        ↓
Học state
        ↓
Code
        ↓
Tôi cần lưu dữ liệu
        ↓
Học API
        ↓
Code API
        ↓
Tôi cần database
        ↓
Học PostgreSQL
        ↓
Code
```

**Project chính là giáo trình.**

---

# 2. Stack cuối cùng

Tôi đề xuất stack này:

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
```

React hiện có tài liệu chính thức cho TypeScript và React Quick Start; Create React App đã deprecated, còn Vite tiếp tục cung cấp template React/TypeScript.

## Backend

```text
Node.js
TypeScript
NestJS
```

NestJS rất phù hợp cho project học software engineering vì framework tổ chức application theo modules, controllers, providers và hỗ trợ validation, authentication, testing, scheduling, queues…

## Database

```text
PostgreSQL
Prisma ORM
```

Prisma cung cấp type-safe database access, migrations và Prisma Studio; PostgreSQL được hỗ trợ trực tiếp. Tại thời điểm hiện tại, Prisma 7 là nhánh GA và Prisma 8 đang ở Release Candidate, nên tôi khuyên project học tập này dùng **Prisma 7**, không chạy theo RC.

## Infrastructure

```text
Git
GitHub
Docker
GitHub Actions
```

## AI

Ban đầu:

```text
LLM API
```

Sau:

```text
Embeddings
Vector search
Semantic search
Personalized recommendation
```

---

# 3. Kiến trúc tổng thể

```text
                    ┌─────────────────────┐
                    │      Browser        │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                           HTTP/JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │      NestJS         │
                    │      REST API       │
                    └──────┬───────┬──────┘
                           │       │
               ┌──────────┘       └──────────────┐
               ▼                                 ▼
      ┌─────────────────┐               ┌─────────────────┐
      │   PostgreSQL    │               │     AI API      │
      │                 │               │                 │
      │ users           │               │ vocabulary      │
      │ words           │               │ examples        │
      │ reviews         │               │ questions       │
      │ decks           │               │ explanations    │
      └─────────────────┘               └─────────────────┘
```

Sau này:

```text
                  ┌──────────────┐
                  │    Redis     │
                  └──────┬───────┘
                         │
                         ▼
                  Queue / Cache
                         │
                         ▼
                  Background Worker
```

---

# 4. Tính năng cuối cùng

## Core

Người dùng có thể:

```text
Register
Login
Logout

Create deck
Add word
Edit word
Delete word

Study flashcards
Take quiz
Review mistakes

Search vocabulary
Filter by topic
Filter by difficulty

Track progress
View statistics
```

## Adaptive learning

App biết:

```text
Bạn nhớ từ nào tốt
Bạn yếu từ nào
Bạn hay sai dạng câu hỏi nào
Bạn nên ôn từ nào hôm nay
```

## AI

AI có thể:

```text
Generate vocabulary
Generate examples
Generate synonyms
Generate antonyms
Generate quiz
Explain mistakes
Generate personalized examples
Generate study suggestions
```

## Multi-language

Kiến trúc cho:

```text
English
Chinese
Japanese
Korean
...
```

---

# 5. Giai đoạn 0 — Chuẩn bị môi trường

## Kiến thức

Bạn cần hiểu:

```text
Node.js
npm
package.json
Git
GitHub
HTTP
JSON
environment variables
```

Bạn không cần học toàn bộ Node trước.

Chỉ cần hiểu:

```text
node
npm
npm install
npm run
package.json
node_modules
.env
```

## Việc phải làm

Tạo repository:

```text
vocab-app
```

Cấu trúc:

```text
vocab-app/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

Ngay commit đầu tiên:

```text
chore: initialize project
```

---

# 6. Workflow sử dụng AI ngay từ ngày đầu

Đây là phần cực kỳ quan trọng.

**AI không nên là người code thay bạn.**

AI nên đóng vai:

```text
Teacher
Reviewer
Debugger
Research assistant
Pair programmer
Architect
```

Không nên:

```text
"Build the entire app for me."
```

Thay vào đó:

```text
"Tôi đang học React.

Đây là component tôi viết...

Hãy:
1. Chỉ ra lỗi.
2. Giải thích tại sao.
3. Gợi ý hướng sửa.
4. Không viết lại toàn bộ code trừ khi tôi yêu cầu."
```

### Quy tắc 80/20

Khi học:

```text
Bạn tự code: 80%
AI: 20%
```

Khi debugging:

```text
Bạn phân tích: trước
AI hỗ trợ: sau
```

---

# 7. Prompt hệ thống dành riêng cho project

Tạo một file:

```text
docs/AI_RULES.md
```

Nội dung bạn dùng làm nguyên tắc khi làm việc với AI:

```text
You are my senior software engineering mentor.

Project:
A multilingual vocabulary learning platform.

My goals:
1. Learn software engineering.
2. Understand the code rather than copy it.
3. Build production-quality architecture progressively.

Rules:
- Do not immediately give me the full solution.
- First explain the problem.
- Identify the concepts I need to learn.
- Give hints before complete code.
- Review my code critically.
- Point out bugs, design problems and security issues.
- Prefer simple architecture before premature abstraction.
- Explain why a technology is used.
- Ask me to reason about trade-offs when appropriate.
- When giving code, explain every important part.
- Keep TypeScript strict.
- Prefer maintainability over cleverness.
- Do not hide errors behind any.
```

Từ đó, mỗi lần làm việc với AI, bạn đều giữ một "mentor mode".

---

# 8. Giai đoạn 1 — Frontend cơ bản

## Mục tiêu

Xây frontend **chưa cần backend**.

Bạn dùng dữ liệu giả:

```ts
const words = [
  {
    id: 1,
    word: "abandon",
    meaning: "từ bỏ",
  },
  {
    id: 2,
    word: "allocate",
    meaning: "phân bổ",
  },
];
```

## Học

```text
TypeScript
React component
props
state
events
forms
conditional rendering
list rendering
hooks
```

React Quick Start tập trung đúng các khái niệm bạn sẽ sử dụng thường xuyên: component, markup, conditional rendering, list, events và state/data sharing.

## Code

Tạo:

```text
/pages
  Home
  Vocabulary
  Flashcard
  Quiz

/components
  Navbar
  WordCard
  Flashcard
  QuizQuestion
  Button
  Input
```

---

# 9. Bài tập bắt buộc trước khi đi tiếp

Không dùng AI để code trực tiếp.

Tự làm:

### Bài 1

Render danh sách từ.

### Bài 2

Search:

```text
input:
app

result:
apple
application
apply
```

### Bài 3

Filter:

```text
All
Business
Technology
Daily Life
```

### Bài 4

Flashcard:

```text
┌─────────────────────┐
│      abandon        │
│                     │
│    [Show Answer]    │
└─────────────────────┘
```

Click:

```text
Show Answer
```

thì hiện meaning.

### Bài 5

Quiz:

```text
abandon means:

A. acquire
B. leave
C. allocate
D. create
```

---

# 10. AI workflow cho giai đoạn React

### Trước khi code

Hỏi:

```text
Tôi cần xây flashcard component.
Không đưa code.

Hãy nói:
- component cần state nào?
- props nào?
- event nào?
- những lỗi thiết kế phổ biến là gì?
```

### Sau khi code

Đưa code cho AI:

```text
Review component này như senior React developer.

Không rewrite toàn bộ.

Hãy đánh giá:
1. correctness
2. state management
3. component design
4. TypeScript
5. readability
6. unnecessary rerender
```

### Khi bug

```text
Đây là lỗi:

[paste error]

Đây là code liên quan:

[paste code]

Hãy:
1. giải thích nguyên nhân
2. chỉ ra dòng đáng nghi
3. đưa 2 cách sửa
4. nói cách tự debug lần sau
```

---

# 11. Giai đoạn 2 — TypeScript nghiêm túc

Bạn đã dùng JS/React rồi thì đây là giai đoạn rất quan trọng.

Học:

```text
type
interface
union
intersection
generic
enum
utility types
optional property
nullable
type narrowing
async/await
Promise<T>
```

Ví dụ:

```ts
type Word = {
  id: string;
  text: string;
  meaning: string;
  difficulty: number;
};
```

Sau đó:

```ts
type ReviewResult =
  | "again"
  | "hard"
  | "good"
  | "easy";
```

Bạn sẽ bắt đầu nhìn thấy lợi ích của type system.

React hỗ trợ TypeScript trực tiếp và tài liệu chính thức có phần riêng cho typing props, hooks và React types.

---

# 12. Giai đoạn 3 — Backend với NestJS

Bây giờ mới tạo:

```text
backend/
```

NestJS hiện yêu cầu Node.js 20+ theo tài liệu chính thức; framework dùng TypeScript và tổ chức ứng dụng thành các module/controllers/providers, rất phù hợp để học backend có cấu trúc.

## Học

```text
HTTP
REST
request
response
status code
controller
service
dependency injection
DTO
validation
exception
middleware
guard
```

---

# 13. REST API đầu tiên

Bạn cần xây:

```text
GET    /words
GET    /words/:id
POST   /words
PATCH  /words/:id
DELETE /words/:id
```

Ví dụ:

```http
GET /api/words
```

Response:

```json
[
  {
    "id": "1",
    "word": "abandon",
    "meaning": "to leave"
  }
]
```

---

# 14. Học HTTP thật sự

Đừng chỉ biết gọi API.

Bạn phải hiểu:

```text
GET
POST
PUT
PATCH
DELETE
```

và:

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

Bạn cũng phải hiểu:

```text
Headers
Body
Query
Params
Cookies
Authorization
Content-Type
```

Đây là kiến thức nền của web development.

---

# 15. Bài tập backend

Tự xây:

```text
POST /words
```

Body:

```json
{
  "word": "allocate",
  "meaning": "phân bổ"
}
```

Sau đó:

```text
GET /words
```

phải trả về từ vừa tạo.

Chưa cần database.

Lưu tạm trong memory:

```ts
const words = [];
```

Mục đích là hiểu HTTP trước.

---

# 16. Giai đoạn 4 — PostgreSQL

Sau khi hiểu API, mới thêm database.

Bạn cần học:

```text
table
row
column
primary key
foreign key
unique
index
JOIN
GROUP BY
ORDER BY
WHERE
aggregation
transaction
normalization
```

Đừng học SQL kiểu thuộc cú pháp.

Hãy lấy chính app của bạn làm bài tập.

---

# 17. Database design

Ban đầu:

```text
users
languages
decks
words
meanings
examples
user_words
reviews
study_sessions
```

## users

```text
id
email
password_hash
created_at
```

## languages

```text
id
code
name
```

Ví dụ:

```text
en | English
zh | Chinese
vi | Vietnamese
```

## words

```text
id
language_id
text
pronunciation
audio_url
created_at
```

## meanings

```text
id
word_id
meaning
part_of_speech
```

## examples

```text
id
word_id
sentence
translation
```

---

# 18. Vì sao database phải thiết kế như vậy?

Bạn muốn tương lai:

```text
English
abandon
```

và:

```text
Chinese
放弃
```

Nếu database ban đầu khóa cứng vào:

```text
english_word
english_meaning
```

thì sau này bạn sẽ phải refactor rất nhiều.

Thiết kế language-neutral từ đầu sẽ tránh điều đó.

---

# 19. Prisma

Dùng Prisma để học:

```text
Schema
Migration
Relation
Query
Transaction
```

Prisma cung cấp type-safe client, migrations và Prisma Studio; tài liệu PostgreSQL hiện tại cũng có quickstart trực tiếp cho TypeScript + PostgreSQL + Prisma.

Nhưng có một nguyên tắc:

> **Không dùng Prisma để trốn SQL.**

Bạn vẫn phải học SQL.

Hãy viết query SQL trực tiếp ít nhất ở mức:

```sql
SELECT
INSERT
UPDATE
DELETE
JOIN
GROUP BY
COUNT
AVG
ORDER BY
LIMIT
OFFSET
```

---

# 20. Giai đoạn 5 — Authentication

Đây là lúc project trở thành ứng dụng thực sự.

Học:

```text
Password hashing
Authentication
Authorization
JWT
Refresh token
Guard
Session
Cookie
CORS
```

Flow:

```text
Register
   ↓
hash password
   ↓
database

Login
   ↓
verify password
   ↓
issue token
   ↓
client
```

Không bao giờ lưu:

```text
password = "123456"
```

Database phải lưu:

```text
password_hash
```

---

# 21. AI hỗ trợ giai đoạn security

Đừng hỏi AI:

```text
"Build authentication for me."
```

Hãy hỏi:

```text
Tôi đang thiết kế authentication cho web app.

Hãy review architecture của tôi.

Tôi đang dùng:
- JWT
- password hashing
- refresh token

Hãy tìm:
- security vulnerability
- token leakage
- CSRF risk
- XSS implications
- improper password handling
- authorization bugs
```

Đây là cách dùng AI cực kỳ có giá trị.

---

# 22. Giai đoạn 6 — Kết nối frontend + backend

Bây giờ:

```text
React
   ↓
HTTP
   ↓
NestJS
   ↓
Prisma
   ↓
PostgreSQL
```

Bạn bỏ toàn bộ mock data.

Vocabulary page lấy dữ liệu thật.

---

# 23. Lúc này bạn phải hiểu flow hoàn chỉnh

Ví dụ:

```text
User clicks "Add Word"
        ↓
React form
        ↓
POST /words
        ↓
NestJS Controller
        ↓
DTO validation
        ↓
WordService
        ↓
Prisma
        ↓
PostgreSQL
        ↓
Response
        ↓
React Query
        ↓
UI update
```

Nếu bạn hiểu được flow này thì trình độ đã khác rất nhiều so với chỉ biết viết React component.

---

# 24. Giai đoạn 7 — Spaced Repetition

Đây là **trái tim algorithmic của project**.

Mỗi user-word cần:

```text
word_id
user_id

state
difficulty
stability

last_review
next_review

correct_count
wrong_count
```

---

# 25. Phiên bản algorithm đầu tiên

Chưa cần SM-2 ngay.

Tự xây:

```text
Again → 10 phút
Hard  → 1 ngày
Good  → 3 ngày
Easy  → 7 ngày
```

Ví dụ:

```ts
type Rating = "again" | "hard" | "good" | "easy";
```

Algorithm:

```text
Again
→ reset

Hard
→ giữ mức thấp

Good
→ tăng interval

Easy
→ tăng interval mạnh
```

---

# 26. Sau khi algorithm đơn giản chạy ổn

Hãy nghiên cứu:

```text
Spaced Repetition
SM-2
FSRS
Ebbinghaus forgetting curve
memory stability
retrievability
```

Đây là thời điểm bạn có thể vận dụng xác suất và thống kê.

**Không lấy algorithm trên mạng rồi copy ngay.**

Hãy tự viết một version ngây thơ trước.

Sau đó:

```text
Version 1
↓
Đọc paper / tài liệu
↓
Version 2
↓
Benchmark
↓
So sánh
```

Đó mới là cách biến project thành project CS.

---

# 27. Giai đoạn 8 — Learning Analytics

Database giờ bắt đầu chứa dữ liệu thật.

Bạn có thể tính:

```text
words learned
reviews today
accuracy
retention
streak
average response time
weak topics
strong topics
```

Dashboard:

```text
Today
──────

32 words reviewed

Accuracy
87%

New words
12

Due reviews
24

Streak
14 days
```

---

# 28. Đây là lúc học Statistics

Ví dụ:

```text
accuracy
= correct / total
```

Theo topic:

```text
Technology   92%
Business     81%
Daily Life   95%
```

Bạn có thể xây:

```text
weakness score
```

Ví dụ:

```text
weakness =
    wrong_rate
    × difficulty
    × days_since_review
```

Chưa cần machine learning.

Chỉ cần **một heuristic có lý**.

---

# 29. Giai đoạn 9 — AI Vocabulary Generation

Bây giờ mới tích hợp AI.

User nhập:

```text
Topic: Software Engineering
Level: B2
Number: 20
```

AI trả:

```text
allocate
deploy
maintain
scalable
dependency
repository
...
```

Nhưng **đừng cho AI trả text tự do**.

Bạn cần structured output.

Ví dụ schema:

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

Sau đó backend validate dữ liệu trước khi lưu DB.

---

# 30. AI phải nằm ở backend

Sai:

```text
React
   ↓
AI API
```

Tốt hơn:

```text
React
   ↓
NestJS
   ↓
AI provider
```

Tại sao?

Vì API key không được nhét vào frontend.

Backend kiểm soát:

```text
authentication
authorization
rate limit
prompt
validation
cost
logging
caching
```

---

# 31. Giai đoạn 10 — AI tạo quiz

Ví dụ database:

```text
word:
allocate
```

AI sinh:

```text
The company decided to ______ more money
to research and development.

A. abandon
B. allocate
C. acquire
D. alter
```

Nhưng AI không nên được quyền tùy tiện lưu dữ liệu.

Flow nên là:

```text
AI
 ↓
structured response
 ↓
validation
 ↓
business rules
 ↓
database
```

---

# 32. Giai đoạn 11 — AI giải thích lỗi

Đây là tính năng giá trị hơn việc "AI sinh từ".

Ví dụ user trả lời sai:

```text
The company ______ additional resources.

A. allocated
B. abandoned
C. acquired
D. amended
```

User chọn:

```text
C
```

App có thể giải thích:

```text
"Allocate" means to distribute resources
for a specific purpose.

"Acquire" means to obtain something.

Therefore "allocated" is correct because
the sentence describes distributing resources.
```

Bạn bắt đầu xây:

> **AI tutor**

chứ không chỉ:

> AI dictionary.

---

# 33. Giai đoạn 12 — Personalized Learning

Đây là feature tôi khuyên bạn đầu tư mạnh nhất.

Hệ thống thu thập:

```text
user
word
review history
mistakes
response time
difficulty
topic
```

Sau đó dự đoán:

```text
What should the user study next?
```

Ban đầu:

```text
rule-based
```

Sau:

```text
recommendation algorithm
```

Sau nữa:

```text
ML model
```

---

# 34. Giai đoạn 13 — Embedding & semantic search

Search thông thường:

```text
"computer"
```

thì tìm:

```text
computer
```

Semantic search có thể hiểu rằng:

```text
computer
```

gần nghĩa với:

```text
PC
computing
processor
machine
```

Bạn có thể xây:

```text
User query
   ↓
Embedding
   ↓
Vector search
   ↓
Similar vocabulary
```

Đây là lúc bạn có thể thêm:

```text
Vector Database
```

hoặc PostgreSQL + vector extension tùy kiến trúc bạn chọn.

---

# 35. Giai đoạn 14 — Testing

Đừng để testing đến cuối.

Bắt đầu từ unit test.

Ví dụ test algorithm:

```text
Given:
Good rating

When:
review is submitted

Then:
next_review must be later than today
```

Test:

```text
calculateNextReview()
```

Sau đó:

```text
service test
controller test
API integration test
E2E test
```

NestJS có sẵn hệ sinh thái hỗ trợ testing trong kiến trúc framework.

---

# 36. Giai đoạn 15 — Docker

Khi app hoạt động:

```text
frontend
backend
database
```

hãy containerize.

Ví dụ:

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

là project chạy được.

Đây là lúc bạn bắt đầu học DevOps thực sự.

---

# 37. Giai đoạn 16 — Deployment

Cuối cùng:

```text
GitHub
   ↓
CI
   ↓
Test
   ↓
Build
   ↓
Deploy
```

Bạn cần biết:

```text
environment variables
production build
database migration
logs
monitoring
rollback
```

---

# 38. Roadmap tổng thể

## Phase 1

```text
HTML
CSS
TypeScript
React
```

Kết quả:

```text
Static vocabulary app
```

---

## Phase 2

```text
React
React Router
State
Forms
API basics
```

Kết quả:

```text
Interactive vocabulary app
```

---

## Phase 3

```text
Node
NestJS
REST
DTO
Validation
```

Kết quả:

```text
Backend API
```

---

## Phase 4

```text
PostgreSQL
SQL
Prisma
Relations
Migration
```

Kết quả:

```text
Persistent database
```

---

## Phase 5

```text
JWT
Password hashing
Authorization
```

Kết quả:

```text
Multi-user application
```

---

## Phase 6

```text
Spaced repetition
Scheduling
Statistics
```

Kết quả:

```text
Real learning system
```

---

## Phase 7

```text
LLM
Structured output
AI generation
AI tutor
```

Kết quả:

```text
AI-powered learning
```

---

## Phase 8

```text
Embeddings
Vector search
Recommendation
```

Kết quả:

```text
Personalized learning
```

---

## Phase 9

```text
Testing
Docker
CI/CD
Deployment
```

Kết quả:

```text
Production application
```

---

# 39. Lịch học mỗi ngày

Đừng code 8 tiếng chỉ vì hứng.

Một phiên 2–3 giờ rất hiệu quả:

```text
30 phút
Học concept

60–90 phút
Code

20 phút
Debug / hỏi AI

20 phút
Review

10 phút
Commit + ghi note
```

Ví dụ hôm nay học:

```text
React useState
```

thì cuối buổi phải có:

```text
1 concept đã hiểu
1 feature đã code
1 bug đã tự debug
1 commit
```

---

# 40. Quy tắc commit

Đừng:

```text
update
fix
code
final
final2
final_final
```

Dùng:

```text
feat: add vocabulary search
feat: implement flashcard interaction
fix: prevent duplicate vocabulary
refactor: extract word card component
test: add review algorithm tests
docs: document database schema
```

Git history của bạn sau vài tháng sẽ trở thành một **learning log**.

---

# 41. Mỗi feature phải trải qua 7 bước

Ví dụ:

> Add vocabulary

```text
1. Requirement
        ↓
2. Design
        ↓
3. Learn required concept
        ↓
4. Implement
        ↓
5. Test
        ↓
6. Review with AI
        ↓
7. Commit
```

Không nhảy thẳng:

```text
Prompt AI → copy → chạy
```

---

# 42. Cách dùng AI trong từng tình huống

## Khi chưa hiểu concept

```text
Giải thích dependency injection trong NestJS
cho một sinh viên CS.

Sau đó:
1. giải thích bản chất
2. ví dụ đời thường
3. ví dụ code
4. khi nào dùng
5. khi nào không nên dùng
```

## Khi đang học

```text
Đừng cho tôi code.

Hãy cho tôi một bài tập về
TypeScript generics liên quan đến vocabulary app.
```

## Khi bí

```text
Tôi đang cố implement X.

Đây là những gì tôi đã thử:
...

Đừng giải ngay.

Hãy cho tôi 3 hints,
từ nhẹ đến mạnh.
```

## Khi debug

```text
Phân tích error này.

Tôi muốn tự sửa trước.

Hãy:
- xác định nhóm nguyên nhân
- nói tôi nên kiểm tra gì
- không đưa code hoàn chỉnh
```

## Khi đã sửa

```text
Đây là solution của tôi.

Review như senior engineer.

Đánh giá:
correctness
complexity
security
maintainability
TypeScript
architecture
```

---

# 43. Một quy tắc cực quan trọng với AI

Mỗi khi AI đưa code, hãy tự hỏi:

```text
Tại sao code này chạy?
```

Nếu không giải thích được:

```text
Không được xem là đã học.
```

Ví dụ AI viết:

```ts
const result = await prisma.word.findMany({
  where: {
    languageId,
  },
});
```

Bạn phải biết:

```text
await là gì?
Promise là gì?
findMany làm gì?
where là gì?
languageId từ đâu?
SQL phía dưới tương đương gì?
index có cần không?
```

---

# 44. Tạo "AI learning loop"

Mỗi feature:

```text
                ┌───────────────┐
                │   Requirement │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │     Learn     │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │      Code     │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │    Debug      │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │   AI Review   │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │     Test      │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │    Reflect    │
                └───────────────┘
```

Đây chính là cách biến AI từ **code generator** thành **learning accelerator**.

---

# 45. File structure cuối cùng

Một cấu trúc có thể tiến hóa thành:

```text
vocab-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
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
│   │   └── common/
│   ├── prisma/
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── ai.md
│   └── AI_RULES.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 46. Definition of Done

Một feature chỉ được coi là xong khi:

```text
[ ] Tôi hiểu requirement
[ ] Tôi hiểu architecture
[ ] Code chạy
[ ] Error handling có
[ ] TypeScript không có lỗi
[ ] Có test phù hợp
[ ] Tôi hiểu code của mình
[ ] AI đã review
[ ] Đã commit
[ ] README/docs được cập nhật nếu cần
```

---

# 47. Những thứ KHÔNG nên làm

## Không học 10 framework cùng lúc

Không:

```text
React
Vue
Angular
Next
Svelte
```

chỉ vì AI bảo chúng phổ biến.

Chọn một:

```text
React
```

và đi đủ sâu.

## Không thêm AI quá sớm

Đừng bắt đầu bằng:

```text
RAG
Vector DB
Agents
MCP
Multi-agent
```

Trong khi:

```text
CRUD
HTTP
SQL
Authentication
```

chưa vững.

## Không microservice quá sớm

Ban đầu:

```text
Monolith
```

là đủ.

Sau này nếu có lý do thật:

```text
Worker
AI service
Search service
```

mới tách.

---

# 48. Thứ tự kiến thức tôi muốn bạn thật sự nắm

Ưu tiên:

```text
1. JavaScript
2. TypeScript
3. React
4. HTTP / REST
5. Node.js
6. NestJS
7. SQL
8. PostgreSQL
9. ORM
10. Authentication
11. Testing
12. Docker
13. Algorithms
14. AI integration
15. Embeddings
16. Recommendation
17. Deployment
```

Đừng đảo thứ tự thành:

```text
AI
↓
RAG
↓
Vector DB
↓
Agent

...
à mà HTTP là gì?
```

😄

---

# 49. Project này có thể giúp bạn đạt tới đâu?

Nếu thực sự hoàn thành toàn bộ roadmap, project sẽ chạm vào:

```text
Frontend Developer
        +
Backend Developer
        +
Database
        +
Software Engineering
        +
Algorithm
        +
AI Integration
        +
DevOps
```

Đặc biệt, bạn sẽ có một câu chuyện portfolio rất tốt:

> "Tôi xây dựng một multilingual vocabulary-learning platform với React/TypeScript, NestJS, PostgreSQL, adaptive spaced repetition và AI-generated learning content."

Quan trọng hơn, bạn có thể **giải thích được tại sao hệ thống được thiết kế như vậy**, thay vì chỉ nói "tôi dùng React và AI".

---

# 50. Mục tiêu MVP đầu tiên

Đừng nghĩ tới phiên bản hoàn chỉnh ngay.

MVP đầu tiên chỉ cần:

```text
Register
Login
Create deck
Add word
View words
Flashcard
Quiz
Review result
```

Không AI.

Không vector database.

Không recommendation.

Không Chinese.

Không Docker.

Không microservices.

Sau khi MVP chạy:

```text
MVP
 ↓
Spaced repetition
 ↓
Statistics
 ↓
AI
 ↓
Personalization
 ↓
Chinese
 ↓
Production
```

---

# 51. Nhiệm vụ đầu tiên của bạn

Ngày đầu tiên **chưa cần xây app học từ vựng hoàn chỉnh**.

Hãy làm:

```text
STEP 1
Tạo GitHub repository

STEP 2
Tạo frontend bằng Vite + React + TypeScript

STEP 3
Tạo backend bằng NestJS

STEP 4
Tạo README

STEP 5
Vẽ architecture

STEP 6
Viết database ERD phiên bản đầu

STEP 7
Code trang Vocabulary bằng mock data
```

Vite hiện cung cấp `create-vite` cho React/TypeScript, còn NestJS có CLI chính thức để scaffold backend TypeScript.

Sau ngày đầu tiên, repository của bạn phải có dạng:

```text
vocab-app/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

và:

```text
React page
+
NestJS server
+
Git repository
```

**chưa cần đẹp.**

Mục tiêu đầu tiên là:

> **"Tôi tự mình dựng được skeleton của một full-stack application."**

---

# 52. Cách chúng ta nên triển khai project này

Tôi khuyên bạn **không học toàn bộ tài liệu này một lần**.

Hãy dùng nó như một curriculum.

Mỗi lần làm một feature, quy trình là:

```text
Bạn:
"Tôi đang làm Phase X."

        ↓

AI:
Giải thích kiến thức cần thiết.

        ↓

Bạn:
Tự code.

        ↓

AI:
Review / debug / challenge.

        ↓

Bạn:
Sửa.

        ↓

AI:
Cho test + edge cases.

        ↓

Bạn:
Commit.

        ↓

Feature hoàn thành.
```

Như vậy, sau vài tháng bạn không chỉ có một app. Bạn sẽ có **một repository thể hiện quá trình trưởng thành từ sinh viên code feature thành developer biết xây hệ thống**. 🚀

### Tài liệu chính nên dùng

React Quick Start và React + TypeScript:

Vite Getting Started:

NestJS First Steps và Fundamentals:

Prisma + PostgreSQL:

**Điểm tôi muốn nhấn mạnh nhất:** đừng biến project này thành một cuộc thi "AI code nhanh hơn tôi". Hãy biến nó thành **phòng gym kỹ thuật của bạn**: mỗi feature là một bài tập, AI là mentor/debugger, còn bạn là người phải hiểu và chịu trách nhiệm cho toàn bộ hệ thống.
