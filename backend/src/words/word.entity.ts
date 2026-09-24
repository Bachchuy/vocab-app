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
  ) {}
}
