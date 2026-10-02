import type { Word } from "../../services/vocabularyStore";
import type { Rating } from "../types";

type StudyProps = {
  word?: Word;
  total: number;
  index: number;
  flipped: boolean;
  reviewing: boolean;
  onFlip: () => void;
  onRate: (rating: Rating) => void;
};

export function Study({
  word,
  total,
  index,
  flipped,
  reviewing,
  onFlip,
  onRate,
}: StudyProps) {
  return (
    <div className="page study">
      <div className="heading">
        <div>
          <p className="eyebrow">Review your collection</p>
          <h1>Ôn lại từ đã lưu</h1>
          <p className="muted">Chỉ ôn những từ đã đến hạn.</p>
        </div>
        <strong>
          {total ? Math.min(index + 1, total) : 0} / {total}
        </strong>
      </div>
      {word ? (
        <>
          <div
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={onFlip}
          >
            <div>
              <small>English word</small>
              <strong>{word.english}</strong>
              <em>Nhấn để lật thẻ</em>
            </div>
            <div>
              <small>Meaning</small>
              <strong>{word.meaning}</strong>
              <p>{word.example || "Bạn chưa thêm ví dụ cho từ này."}</p>
            </div>
          </div>
          <p className="question">Bạn nhớ từ này đến đâu?</p>
          <div className="ratings">
            <button disabled={reviewing} onClick={() => onRate("again")}>
              ↻ <b>Chưa nhớ</b>
              <small>10 phút</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("hard")}>
              • <b>Khó</b>
              <small>1 ngày</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("good")}>
              ✓ <b>Được</b>
              <small>2 ngày</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("easy")}>
              ✦ <b>Dễ</b>
              <small>4 ngày</small>
            </button>
          </div>
        </>
      ) : (
        <div className="finished">
          <h2>
            ✦<br />
            Không còn từ đến hạn!
          </h2>
          <p>Các từ đã lên lịch sẽ xuất hiện ở lần ôn tiếp theo.</p>
        </div>
      )}
    </div>
  );
}
