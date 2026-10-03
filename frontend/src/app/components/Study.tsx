import type { Word } from "../../services/vocabularyStore";
import type { Rating } from "../types";

type StudyMode = "due" | "extra" | "weak";

type StudyProps = {
  mode: StudyMode;
  word?: Word;
  total: number;
  index: number;
  flipped: boolean;
  reviewing: boolean;
  extraAvailable: boolean;
  weakAvailable: boolean;
  onExtraReview: () => void;
  onWeakReview: () => void;
  onFlip: () => void;
  onRate: (rating: Rating) => void;
};

export function Study({
  mode,
  word,
  total,
  index,
  flipped,
  reviewing,
  extraAvailable,
  weakAvailable,
  onExtraReview,
  onWeakReview,
  onFlip,
  onRate,
}: StudyProps) {
  return (
    <div className="page study">
      <div className="heading">
        <div>
          <p className="eyebrow">
            {mode === "due"
              ? "Review your collection"
              : mode === "extra"
                ? "Extra practice · không đổi lịch"
                : "Focus practice · từ hay quên"}
          </p>
          <h1>
            {mode === "due"
              ? "Ôn lại từ đã lưu"
              : mode === "extra"
                ? "Ôn thêm tự do"
                : "Ôn từ hay quên"}
          </h1>
          <p className="muted">
            {mode === "due"
              ? "Chỉ ôn những từ đã đến hạn."
              : mode === "extra"
                ? "Luyện thêm mà không thay đổi lịch ôn chính."
                : "Tập trung vào các từ có nhiều lần trả lời sai."}
          </p>
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
              {word.detailedExplanation && <details className="study-explanation" onClick={(event) => event.stopPropagation()}><summary>Giải nghĩa chi tiết</summary><p>{word.detailedExplanation}</p></details>}
              <p>{word.example || "Bạn chưa thêm ví dụ cho từ này."}</p>
            </div>
          </div>
          <p className="question">Bạn nhớ từ này đến đâu?</p>
          <div className="ratings">
            <button disabled={reviewing} onClick={() => onRate("again")}>
              ↻ <b>Chưa nhớ</b>
              <small>{mode === "due" ? "10 phút" : "Không đổi lịch"}</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("hard")}>
              • <b>Khó</b>
              <small>{mode === "due" ? "1 ngày" : "Không đổi lịch"}</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("good")}>
              ✓ <b>Được</b>
              <small>{mode === "due" ? "2 ngày" : "Không đổi lịch"}</small>
            </button>
            <button disabled={reviewing} onClick={() => onRate("easy")}>
              ✦ <b>Dễ</b>
              <small>{mode === "due" ? "4 ngày" : "Không đổi lịch"}</small>
            </button>
          </div>
        </>
      ) : (
        <div className="finished">
          <h2>
            ✦<br />
            {mode === "due"
              ? "Không còn từ đến hạn!"
              : "Đã hoàn thành lượt luyện!"}
          </h2>
          <p>
            {mode === "due"
              ? "Bạn có thể chọn một chế độ luyện thêm bên dưới."
              : "Bạn có thể chuyển sang một chế độ luyện khác."}
          </p>
          {extraAvailable && (
            <button className="primary extra-review-button" onClick={onExtraReview}>
              Ôn thêm các từ đang học
            </button>
          )}
          {weakAvailable && (
            <button className="secondary-button extra-review-button" onClick={onWeakReview}>
              Ôn từ hay quên
            </button>
          )}
        </div>
      )}
    </div>
  );
}
