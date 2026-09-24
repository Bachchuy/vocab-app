// Import hook chạy side effect và hook lưu state của React.
import { useEffect, useState } from 'react';

// Kiểu dữ liệu frontend nhận được từ API /words.
type Word = {
  id: number;
  english: string;
  meaning: string;
  example: string;
  category: string;
};

// Giá trị ban đầu dùng để reset form sau khi thêm thành công.
const emptyForm = {
  english: '',
  meaning: '',
  example: '',
  category: 'general',
};

// Đọc URL API từ biến môi trường; fallback giúp chạy local ngay lập tức.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Component gốc của màn hình quản lý từ vựng.
export default function App() {
  // State lưu danh sách từ lấy từ backend.
  const [words, setWords] = useState<Word[]>([]);
  // State lưu dữ liệu hiện tại trong form.
  const [form, setForm] = useState(emptyForm);
  // State hiển thị thông báo thành công hoặc thất bại.
  const [message, setMessage] = useState('');

  // Hàm gọi API để lấy danh sách từ mới nhất.
  const fetchWords = async () => {
    try {
      // Gửi request GET tới backend.
      const response = await fetch(`${API_URL}/words`);

      // HTTP lỗi không nên bị coi là dữ liệu hợp lệ.
      if (!response.ok) {
        throw new Error(`Fetch words failed with status ${response.status}`);
      }

      // Chuyển JSON response thành object JavaScript.
      const data = await response.json();
      // Cập nhật state để React render lại danh sách.
      setWords(data);
    } catch (error) {
      // In lỗi kỹ thuật để developer xem trong DevTools.
      console.error('Failed to fetch words:', error);
      // Hiển thị thông báo dễ hiểu cho người dùng.
      setMessage('Không thể kết nối tới backend. Hãy đảm bảo server đang chạy.');
    }
  };

  // Chạy một lần sau lần render đầu tiên để tải dữ liệu ban đầu.
  useEffect(() => {
    fetchWords();
  }, []);

  // Cập nhật một field trong form mà không làm mất các field khác.
  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Xử lý lúc người dùng bấm nút Add word.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Ngăn trình duyệt reload trang theo hành vi mặc định của form.
    event.preventDefault();

    try {
      // Gửi dữ liệu form lên backend bằng HTTP POST.
      const response = await fetch(`${API_URL}/words`, {
        method: 'POST',
        // Báo cho backend biết body là JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Chuyển object form thành chuỗi JSON.
        body: JSON.stringify(form),
      });

      // Nếu API trả lỗi thì chuyển sang khối catch.
      if (!response.ok) {
        throw new Error('Create word failed');
      }

      // Xóa dữ liệu cũ để chuẩn bị cho lần nhập tiếp theo.
      setForm(emptyForm);
      // Thông báo thao tác đã thành công.
      setMessage('Từ mới đã được thêm thành công.');
      // Tải lại danh sách để hiển thị từ vừa tạo.
      await fetchWords();
    } catch (error) {
      // Ghi log lỗi dành cho developer.
      console.error(error);
      // Hiển thị thông báo thân thiện với người dùng.
      setMessage('Thêm từ thất bại. Vui lòng kiểm tra dữ liệu nhập.');
    }
  };

  // JSX mô tả cấu trúc giao diện mà React sẽ render.
  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Vocabulary app</p>
        <h1>Vocab learning dashboard</h1>
        <p className="subtitle">
          Quản lý từ vựng, học và ôn tập.
        </p>

        <form className="word-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="English"
            value={form.english}
            onChange={(event) => handleChange('english', event.target.value)}
          />
          <input
            type="text"
            placeholder="Meaning"
            value={form.meaning}
            onChange={(event) => handleChange('meaning', event.target.value)}
          />
          <input
            type="text"
            placeholder="Example"
            value={form.example}
            onChange={(event) => handleChange('example', event.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(event) => handleChange('category', event.target.value)}
          />
          <button type="submit">Add word</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="word-grid">
          {words.map((item) => (
            <article key={item.id} className="word-item">
              <h2>{item.english}</h2>
              <span>{item.meaning}</span>
              <small>{item.example || 'No example yet'}</small>
              <em>{item.category}</em>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
