// Đại diện cho một từ vựng trong bộ nhớ của ứng dụng.
export class Word {
  // Constructor nhận toàn bộ dữ liệu để tạo một object Word hoàn chỉnh.
  constructor(
    // Mã số duy nhất của từ.
    public id: number,
    // Từ tiếng Anh.
    public english: string,
    // Nghĩa tiếng Việt hoặc ngôn ngữ đích.
    public meaning: string,
    // Câu ví dụ minh họa cách dùng.
    public example: string,
    // Nhóm chủ đề của từ.
    public category: string,
    // Nguồn hoặc ngữ cảnh nơi học viên bắt gặp từ.
    public source: string = '',
    // Ghi chú cá nhân giúp nhớ cách dùng của từ.
    public notes: string = '',
    // Lemma giúp nhóm các dạng biến đổi của cùng một từ.
    public lemma: string = english,
    // Ngôn ngữ nguồn và ngôn ngữ giải thích để mở rộng đa ngôn ngữ.
    public sourceLanguage: string = 'en',
    public explanationLanguage: string = 'vi',
    // Từ loại và tags là metadata tùy chọn của mục từ.
    public partOfSpeech: string = '',
    public tags: string[] = [],
    public dateAdded: string = new Date().toISOString(),
  ) {}
}
