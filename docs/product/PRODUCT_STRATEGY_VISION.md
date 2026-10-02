# Tầm nhìn và định hướng sản phẩm Lexicon

> Tài liệu định hướng sản phẩm cho đội ngũ phát triển và trợ lý AI. Đây là tầm nhìn cùng lộ trình đề xuất, không phải danh sách tính năng đã hoàn thành.

## 1. Tầm nhìn sản phẩm

Lexicon là **từ điển cá nhân**: người học tự thu thập từ mình gặp, bổ sung ý nghĩa và ngữ cảnh, rồi ôn tập để biến chúng thành vốn từ chủ động. Ứng dụng không lấy một giáo trình có sẵn làm trung tâm; thư viện do người dùng xây dựng mới là tài sản chính.

Các tính năng AI, ôn tập, gamification và giao diện đều nên giúp người dùng:

- Lưu nhanh từ bắt gặp trong đời sống, công việc và tài liệu học tập.
- Gắn mỗi từ với ngữ cảnh và nguồn riêng để nhớ lý do mình đã lưu nó.
- Hiểu và sử dụng được từ trong tình huống thực tế, không chỉ nhận ra bản dịch.
- Giữ quyền kiểm soát dữ liệu, nội dung AI đề xuất và chi phí AI.

## 2. Nguyên tắc sản phẩm

1. **Từ điển của người học là trọng tâm.** Tính năng mới phải làm thư viện cá nhân hữu ích hơn.
2. **Ngữ cảnh đi cùng từ vựng.** Phân biệt `context` (tình huống/câu liên quan) với `source` (nơi bắt gặp, chẳng hạn tên phim hoặc sách).
3. **AI đề xuất, người dùng quyết định.** AI không tự lưu, ghi đè dữ liệu hoặc tự gọi khi chưa có thao tác rõ ràng.
4. **Tính năng cốt lõi không phụ thuộc AI.** Người dùng vẫn có thể thêm từ và ôn tập khi chưa cấu hình API key hoặc đang ngoại tuyến.
5. **Tôn trọng dữ liệu và chi phí.** Chỉ gửi dữ liệu cần cho tác vụ đã chọn; giải thích rõ khi nội dung được gửi tới nhà cung cấp AI.
6. **Trạng thái học phải phản ánh kết quả ôn tập.** Kanban, dashboard và gamification lấy trạng thái từ bộ lập lịch ôn tập, tránh tạo ra nhiều nguồn trạng thái mâu thuẫn.
7. **Khuyến khích thay vì trừng phạt.** Gamification nên tạo động lực quay lại học; không xóa tiến độ, làm hỏng tài sản đã tích lũy hoặc gây cảm giác bị phạt khi người dùng nghỉ.

## 3. Chiến lược tính năng

### 3.1. Thu thập và tương tác cá nhân

#### AI điền gợi ý

Khi người dùng nhập từ, AI có thể đề xuất các trường hữu ích như nghĩa, từ loại, phát âm, ví dụ, họ từ, kết hợp từ, cấu trúc ngữ pháp và ngữ cảnh. Trường `source` cho phép ghi nơi bắt gặp từ; `context` giữ câu hoặc tình huống liên quan.

Luồng mong muốn:

1. Người dùng nhập từ và thông tin đã biết.
2. Người dùng chủ động yêu cầu AI gợi ý.
3. Ứng dụng kiểm tra cấu trúc phản hồi rồi điền vào biểu mẫu.
4. Người dùng xem lại, sửa hoặc bỏ từng nội dung và tự lưu.

#### Bài tập dựa trên thư viện cá nhân

- **Flashcard theo ngữ cảnh:** dùng câu hoặc tình huống người dùng đã lưu để gợi lại từ cần nhớ.
- **Trắc nghiệm:** ưu tiên lấy đáp án nhiễu từ các từ đã có trong thư viện, nếu dữ liệu đủ phù hợp. Không tạo lựa chọn sai gây hiểu nhầm về nghĩa.
- **Gõ lại từ:** yêu cầu người học nhập từ dựa trên gợi ý nghĩa, âm thanh hoặc ngữ cảnh.
- Mọi dạng bài tập cần ghi nhận kết quả qua cùng một hệ thống ôn tập ngắt quãng (SRS).

### 3.2. Không gian quản lý tri thức

#### Hành trình học từ

Một bảng Kanban có thể trình bày các nhóm như **Mới lưu**, **Đang học** và **Đã thuộc**. Đây là góc nhìn trực quan lên dữ liệu ôn tập, không phải một trạng thái độc lập được cập nhật riêng.

Quy tắc chuyển nhóm phải dựa trên kết quả và lịch ôn của SRS. Ngưỡng để một từ được xem là đã thuộc cần được xác định bằng hành vi học tập và đánh giá sử dụng, thay vì gắn cứng một con số tùy ý trong giao diện.

#### Trang chi tiết theo khối nội dung

Trang chi tiết có thể được tổ chức thành các khối độc lập để dễ xem và mở rộng:

1. Từ, nghĩa và các nghĩa liên quan.
2. Phát âm và thông tin ngữ pháp.
3. Ngữ cảnh cá nhân và nguồn.
4. Ví dụ, cụm từ và quan hệ với từ khác.
5. Hình ảnh hỗ trợ ghi nhớ (tùy chọn, nếu có giá trị và chi phí phù hợp).

Nên bắt đầu bằng các thành phần UI thông thường có thể tái sử dụng; chỉ cần xây một trình biên tập block tổng quát khi nhu cầu thực tế chứng minh lợi ích.

### 3.3. Gamification và duy trì thói quen

#### Thống kê học tập

Dashboard nên ưu tiên các con số giúp người học quyết định việc cần làm tiếp theo:

- Số từ đến hạn và số lượt ôn đã hoàn thành hôm nay.
- Hoạt động trong tuần và số ngày có học.
- Từ đang học, từ đã thuộc và xu hướng ghi nhớ theo thời gian.
- Mục tiêu tuần cùng tiến độ hoàn thành.

Mỗi chỉ số phải có định nghĩa dễ hiểu. Không đánh đồng số lượng từ đã lưu với năng lực sử dụng ngôn ngữ, và không dùng dữ liệu thiếu để tạo ra điểm số có vẻ chính xác.

#### Thành tích

Thành tích có thể ghi nhận các mốc học có ý nghĩa như hoàn thành những lượt ôn đầu tiên, duy trì mục tiêu tuần, hoặc nhớ lại từ qua nhiều lần ôn. Ưu tiên ghi nhận nỗ lực và độ bền ghi nhớ thay vì chỉ thưởng cho việc thêm thật nhiều từ.

#### Chuỗi học (streak)

Chuỗi học nên tính theo ngày có một hoạt động học/ôn đạt tiêu chí tối thiểu, không tính việc chỉ mở ứng dụng. Cho người học đặt mục tiêu vừa sức và xem rõ cách chuỗi được tính. Có thể hỗ trợ ngày nghỉ hoặc cơ chế khôi phục nhẹ nhàng; không xóa thành tích, hạ cấp hay gây cảm giác mất hết tiến độ khi chuỗi bị ngắt.

Nguồn tính nên là lịch sử phiên ôn với thời điểm hoàn tất. Quy ước ranh giới ngày và timezone phải nhất quán giữa desktop và browser; bộ đếm chuỗi là dữ liệu dẫn xuất, không phải một nguồn dữ liệu độc lập. Chỉ cân nhắc cache nếu có nhu cầu hiệu năng và có thể dựng lại từ lịch sử gốc.

#### Bộ sưu tập tiến bộ

Bộ sưu tập hoặc “bảo tàng từ vựng” có thể mở khóa vật phẩm/trang trí theo các mốc tiến bộ. Nếu người dùng bỏ lỡ lịch ôn, ứng dụng nên nhắc quay lại và giúp khôi phục nhịp học; không làm giảm cấp, phá công trình hoặc xóa thành quả đã đạt.

### 3.4. AI tạo sinh nâng cao

- **Câu chuyện theo lịch ôn:** tạo đoạn văn ngắn dùng một nhóm từ đến hạn, sau đó để người dùng kiểm tra từ trong ngữ cảnh. Số từ yêu cầu dùng phải được xác thực; không tuyên bố đã dùng đủ nếu phản hồi không đạt.
- **Liên kết cấu tạo và họ từ:** gợi ý tiền tố, gốc từ, hậu tố hoặc quan hệ với từ đã lưu. Mọi liên kết cần có giải thích và có thể bị người dùng bỏ qua hoặc sửa.
- Đây là tính năng gọi AI tùy chọn; cần cho người dùng chọn thời điểm chạy, nhóm từ và độ dài để kiểm soát quota.

## 4. Nền tảng kỹ thuật hiện tại

Tài liệu này phải được đọc cùng [Hướng dẫn AI](../ai/AI_SUPPORT.md), [Mô hình từ vựng](VOCABULARY_MODEL.md) và [Hướng dẫn desktop Windows](../desktop/LEXICON_WINDOWS_DESKTOP_GUIDE.txt).

- **Desktop:** Tauri 2 với giao diện React/Vite. Bản desktop lưu từ vựng và lịch ôn trong SQLite cục bộ qua Tauri SQL plugin.
- **Browser/backend:** còn có luồng phát triển dựa trên NestJS/Prisma. Dữ liệu browser/backend và desktop chưa tự đồng bộ; không được giả định rằng hai kho dữ liệu đã hợp nhất.
- **AI:** lớp dùng chung hiện nằm dưới `frontend/src/ai/`: hợp đồng provider, registry, cài đặt, adapter Gemini và feature riêng cho gợi ý từ. API key do người dùng cấu hình; request gửi trực tiếp tới provider trong luồng hiện tại.
- **Từ vựng:** `context` và `source` đã là các trường của mục từ. Trạng thái ôn tập nằm trong `ReviewState`, tách khỏi dữ liệu từ.

### Quy tắc mở rộng kiến trúc

- Không đưa lời gọi Gemini/OpenAI trực tiếp vào component giao diện. UI gọi use case/feature, feature dùng hợp đồng provider.
- Mỗi tác vụ AI mới có input, prompt, schema đầu ra và kiểm tra dữ liệu riêng; không biến provider thành nơi chứa logic sản phẩm.
- Adapter có thể được thay bằng dịch vụ server-side hoặc mô hình cục bộ nếu sản phẩm đổi chiến lược. Tính năng không nên phụ thuộc vào một provider cụ thể.
- Không thêm một trường trạng thái học thứ hai vào `Word` nếu trạng thái đó chỉ có thể suy ra từ lịch ôn. Nếu cần trạng thái biên tập độc lập, phải định nghĩa rõ ý nghĩa và quan hệ với SRS.
- Khi thay đổi mô hình từ, cập nhật migration/schema lưu trữ, import/export, biểu mẫu, kiểm tra AI và tài liệu tương ứng.
- Không áp dụng Prisma hoặc NestJS cho kho desktop chỉ vì chúng có trong luồng backend/browser hiện tại. Chọn persistence phù hợp từng nền tảng và lập kế hoạch migration trước khi đổi.

## 5. Lộ trình đề xuất

Các giai đoạn dưới đây là thứ tự ưu tiên đề xuất. Mốc thời gian và phạm vi cần điều chỉnh theo phản hồi người dùng và năng lực phát triển.

### Giai đoạn 1 — Củng cố từ điển cá nhân và ôn tập

- Hoàn thiện việc thêm, sửa, xem, nhập và xuất dữ liệu từ.
- Giữ `context` và `source` nhất quán trong desktop, browser/backend và JSON.
- Củng cố lịch sử ôn, trạng thái ôn và các quy tắc chuyển trạng thái.
- Hoàn thiện luồng AI điền gợi ý: lỗi dễ hiểu, kiểm tra dữ liệu, người dùng xem lại trước khi lưu.
- Ghi rõ khác biệt giữa lưu cục bộ và browser/backend; chưa giả định có đồng bộ.

### Giai đoạn 2 — Bài tập và quản lý trực quan

- Cải thiện flashcard dựa trên ngữ cảnh cá nhân.
- Thử nghiệm trắc nghiệm và gõ lại từ, cùng cập nhật một nguồn SRS.
- Phác thảo Kanban dựa trên `ReviewState`; xác định ngưỡng trạng thái trước khi triển khai.
- Chia trang chi tiết thành các khối có thể bảo trì mà vẫn giữ thao tác sửa từ đơn giản.

### Giai đoạn 3 — AI liên kết tri thức

- Tạo câu chuyện hoặc bài đọc ngắn từ nhóm từ được chọn/đến hạn.
- Gợi ý họ từ, cấu tạo từ và liên kết tới các mục từ sẵn có.
- Đặt giới hạn đầu vào, số lượt gọi, xử lý quota và kiểm tra nội dung đầu ra.
- Theo dõi mức hữu ích bằng phản hồi người dùng, không chỉ số lần gọi AI.

### Giai đoạn 4 — Động lực và trải nghiệm dài hạn

- Xây bảng thống kê rõ định nghĩa, bắt đầu từ hoạt động hôm nay/tuần và tiến độ mục tiêu.
- Thử nghiệm thành tích gắn với ôn tập và ghi nhớ bền, không chỉ số lượng từ đã lưu.
- Thêm chuỗi học dựa trên phiên học thực tế, có cách xử lý ngày nghỉ và ngắt chuỗi nhẹ nhàng.
- Thử nghiệm bộ sưu tập và bảo tàng từ vựng như phần thưởng tùy chọn.
- Đưa ra chỉ số tiến bộ dễ hiểu, tránh gây áp lực hoặc đánh giá sai năng lực.
- Chỉ giữ cơ chế gamification nếu thử nghiệm cho thấy nó cải thiện việc học và quay lại ứng dụng.

## 6. Tiêu chí hoàn thành cho tính năng mới

Trước khi coi một tính năng từ vựng hoặc AI là hoàn tất, cần trả lời được:

- Tính năng giúp người học làm gì với chính thư viện của họ?
- Dữ liệu cần được lưu ở đâu, có hoạt động trong desktop và browser/backend không?
- `context`, `source`, dữ liệu cũ và import/export có được xử lý nhất quán không?
- AI có được gọi theo thao tác chủ động, có kiểm tra phản hồi, và người dùng có thể sửa trước khi lưu không?
- Mọi kết quả bài tập có cập nhật đúng SRS không?
- Lỗi, quota, ngoại tuyến và trường hợp không có dữ liệu phù hợp được xử lý ra sao?
- Quyền riêng tư, chi phí và nội dung gửi tới provider đã được giải thích chưa?

## 7. Nguyên tắc dành cho trợ lý AI khi sửa mã

Khi thực hiện công việc theo định hướng này:

1. Đọc cấu trúc và tài liệu hiện có trước khi sửa; coi phần roadmap là mục tiêu tương lai, không phải bằng chứng rằng tính năng đã tồn tại.
2. Ưu tiên tận dụng `frontend/src/ai/providerRegistry.ts`, hợp đồng trong `frontend/src/ai/contracts.ts` và feature riêng dưới `frontend/src/ai/features/`.
3. Dùng `context` và `source` có ý nghĩa riêng; giữ tương thích với dữ liệu cũ khi thay đổi cách lưu.
4. Để SRS làm nguồn quyết định cho trạng thái học, trừ khi yêu cầu sản phẩm định nghĩa một trạng thái khác rõ ràng.
5. Thực hiện thay đổi nhỏ, phù hợp với kiến trúc nền tảng đang sửa; không tự thêm backend, dịch vụ có phí hoặc cơ chế đồng bộ ngoài phạm vi yêu cầu.
6. Nêu rõ tính năng nào đã được triển khai, lựa chọn nào chỉ là đề xuất và giới hạn nào còn lại.
