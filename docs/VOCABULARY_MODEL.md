# Mô hình từ vựng

Lexicon hiện bắt đầu với tiếng Anh, nhưng mô hình dữ liệu tách riêng thông tin ngôn ngữ khỏi mục tiêu học. Vì vậy sau này có thể thêm ngôn ngữ khác mà không phải thay đổi ý nghĩa của một mục từ.

## Các nhóm trường chính

| Nhóm                       | Trường                                                                              | Mục đích                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Định danh                  | `term`, `lemma`, `sourceLanguage`                                                   | Mục từ hiển thị, dạng từ điển và mã ngôn ngữ. `english` vẫn được giữ làm bí danh tương thích với client cũ.                                 |
| Dịch nghĩa                 | `meaning`, `explanationLanguage`, `senses`                                          | Nghĩa ngắn để tương thích dữ liệu cũ và danh sách các nghĩa riêng. Mỗi nghĩa có thể có định nghĩa, bản dịch, ví dụ và ghi chú cách dùng.    |
| Trình độ và mức độ sử dụng | `cefrLevel`, `frequency`, `register`, `category`, `tags`                            | `CEFR` là thang trình độ chung. Tần suất và văn phong mô tả mức độ hữu ích; chủ đề và nhãn phục vụ việc sắp xếp cá nhân.                    |
| Phát âm                    | `pronunciation`, `pronunciationUS`, `pronunciationUK`, `syllables`, `stressPattern` | Phiên âm, biến thể vùng miền, số âm tiết và trọng âm.                                                                                       |
| Ngữ pháp                   | `partOfSpeech`, `wordForms`, `grammarPatterns`                                      | Từ loại chính, các dạng biến đổi/phái sinh và mẫu kết hợp như `depend on + noun`.                                                           |
| Quan hệ nghĩa              | `synonyms`, `antonyms`, `collocations`                                              | Từ đồng nghĩa, trái nghĩa và các cụm từ thường đi cùng, giúp người học sử dụng từ chủ động hơn.                                             |
| Ngữ cảnh sử dụng           | `example`, `context`, `source`, `usageNotes`, `etymology`, `notes`                  | Câu ví dụ tự nhiên, bối cảnh, nguồn bắt gặp, ghi chú cách dùng, nguồn gốc từ và ghi chú cá nhân.                                            |
| Mục tiêu học               | `learningGoals`                                                                     | Các mục tiêu tùy chọn như `general`, `TOEIC`, `IELTS`, tiếng Anh thương mại hoặc khóa học cá nhân. Mục tiêu không làm thay đổi bản thân từ. |

## Quy tắc mô hình hóa

- `cefrLevel` chỉ nhận các mức từ `A1` đến `C2`; đây là trình độ ngôn ngữ chung, không phải điểm thi.
- TOEIC, IELTS và các chương trình tương tự được lưu trong `learningGoals`, không đặt vào nhóm trường cốt lõi của từ.
- Một từ có thể có nhiều `senses` và nhiều `learningGoals`.
- AI được phép đề xuất các thông tin ngôn ngữ như CEFR, nghĩa, phát âm và mẫu ngữ pháp. Người học vẫn phải xem lại trước khi lưu.
- Mục tiêu học không được ghi đè lên định nghĩa, trình độ hoặc ngữ cảnh sử dụng. Nó chỉ là bộ lọc và góc nhìn ôn tập.

Entity backend là một aggregate theo hướng OOP. Constructor nhận một object `WordProps`, bảo vệ các collection, cung cấp hành vi nghiệp vụ như `hasLearningGoal` và dùng `toJSON()` tại ranh giới API. Hiện tại Prisma lưu các collection lồng nhau dưới dạng JSON; sau này có thể tách thành bảng liên quan nếu cần truy vấn riêng từng nghĩa hoặc từng mục tiêu học.
