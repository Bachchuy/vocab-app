import { useEffect, useMemo, useState } from "react";
import {
  deleteWord,
  exportWordsFile,
  importWordsFile,
  listWords,
  reviewStates as loadReviewStates,
  reviewWord,
  saveWord,
  suggestWord,
  type ReviewState,
  type Word,
  type WordForm,
  type WordSuggestion,
} from "./services/vocabularyStore";
import { errorText } from "./app/errorText";
import { Sidebar } from "./app/components/Sidebar";
import { DetailBlock } from "./app/components/DetailBlock";
import { Study } from "./app/components/Study";
import { AiSettingsPage } from "./app/screens/AiSettingsPage";
import { blankForm, type FormState, type Rating } from "./app/types";

const blank = blankForm;
type StudyMode = "due" | "extra" | "weak";

export default function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [screen, setScreen] = useState<
    "library" | "study" | "dashboard" | "settings"
  >("library");
  const [selected, setSelected] = useState<Word | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<FormState>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>("due");
  const [flipped, setFlipped] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewStates, setReviewStates] = useState<Record<number, ReviewState>>(
    {},
  );

  const loadWords = async () => {
    setLoading(true);
    try {
      const [loadedWords, states] = await Promise.all([
        listWords(),
        loadReviewStates(),
      ]);
      setWords(loadedWords);
      setReviewStates(
        Object.fromEntries(states.map((state) => [state.wordId, state])),
      );
    } catch (error) {
      setNotice(`Không thể tải dữ liệu: ${errorText(error)}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadWords();
  }, []);
  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (selected)
      setSelected(words.find((word) => word.id === selected.id) ?? null);
  }, [words]);
  const categories = useMemo(
    () => ["all", ...new Set(words.map((word) => word.category))],
    [words],
  );
  const visibleWords = useMemo(
    () =>
      [
        ...words.filter(
          (word) =>
            `${word.english} ${word.meaning} ${word.example} ${word.source} ${word.notes}`
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (category === "all" || word.category === category),
        ),
      ].sort((a, b) =>
        sort === "az"
          ? a.english.localeCompare(b.english)
          : sort === "za"
            ? b.english.localeCompare(a.english)
            : b.id - a.id,
      ),
    [words, query, category, sort],
  );
  const now = Date.now();
  const dueWords = words.filter((word) => {
    const state = reviewStates[word.id];
    return (
      !state ||
      (state.status !== "mastered" && new Date(state.dueAt).getTime() <= now)
    );
  });
  const extraWords = words
    .filter((word) => reviewStates[word.id]?.status !== "mastered")
    .sort(
      (a, b) =>
        (reviewStates[a.id]?.lastReviewedAt ?? "").localeCompare(
          reviewStates[b.id]?.lastReviewedAt ?? "",
        ) || a.id - b.id,
    );
  const weakWords = words
    .filter((word) => reviewStates[word.id]?.status !== "mastered")
    .sort(
      (a, b) =>
        (reviewStates[b.id]?.incorrectCount ?? 0) -
          (reviewStates[a.id]?.incorrectCount ?? 0) ||
        (reviewStates[b.id]?.reviewCount ?? 0) -
          (reviewStates[a.id]?.reviewCount ?? 0) ||
        a.id - b.id,
    );
  const studyWords =
    studyMode === "extra" ? extraWords : studyMode === "weak" ? weakWords : dueWords;
  const currentWord = studyWords[studyIndex % Math.max(studyWords.length, 1)];
  const update = (field: keyof FormState, value: string) =>
    setForm((old) => ({ ...old, [field]: value }) as FormState);
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (word: Word) => {
    setEditing(word.id);
    setForm({
      ...word,
      lemma: word.lemma ?? "",
      sourceLanguage: word.sourceLanguage ?? "en",
      explanationLanguage: word.explanationLanguage ?? "vi",
      partOfSpeech: word.partOfSpeech ?? "",
      tags: word.tags ?? [],
      pronunciation: word.pronunciation ?? "",
      context: word.context ?? "",
      wordFormsText: (word.wordForms ?? [])
        .map((item) => `${item.partOfSpeech} | ${item.form} | ${item.meaning}`)
        .join("\n"),
      synonymsText: (word.synonyms ?? []).join(", "),
      antonymsText: (word.antonyms ?? []).join(", "),
      collocationsText: (word.collocations ?? []).join(", "),
    });
    setModal(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.english.trim() || !form.meaning.trim()) {
      setNotice("Hãy nhập từ và nghĩa của từ.");
      return;
    }
    setSaving(true);
    try {
      const wordForms = form.wordFormsText
        .split("\n")
        .map((line) => line.split("|").map((value) => value.trim()))
        .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
        .map(([partOfSpeech, word, meaning = ""]) => ({
          partOfSpeech,
          form: word,
          meaning,
        }));
      const list = (value: string) =>
        value
          .split(/[\n,;]/)
          .map((item) => item.trim())
          .filter(Boolean);
      const {
        wordFormsText,
        synonymsText,
        antonymsText,
        collocationsText,
        ...fields
      } = form;
      await saveWord(
        {
          ...fields,
          wordForms,
          synonyms: list(synonymsText),
          antonyms: list(antonymsText),
          collocations: list(collocationsText),
        },
        editing ?? undefined,
      );
      setModal(false);
      setForm(blank);
      setNotice(editing ? "Đã cập nhật mục từ." : "Đã lưu từ vào từ điển.");
      await loadWords();
    } catch (error) {
      setNotice(`Không thể lưu thay đổi: ${errorText(error)}`);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (word: Word) => {
    if (!window.confirm(`Xóa “${word.english}” khỏi từ điển?`)) return;
    try {
      await deleteWord(word.id);
      setSelected(null);
      setNotice(`Đã xóa “${word.english}”.`);
      await loadWords();
    } catch (error) {
      setNotice(`Không thể xóa mục từ: ${errorText(error)}`);
    }
  };
  const openStudy = (mode: StudyMode = "due") => {
    setScreen("study");
    setSelected(null);
    setStudyMode(mode);
    setStudyIndex(0);
    setFlipped(false);
  };
  const rate = async (rating: Rating) => {
    if (!currentWord || reviewing) return;
    setReviewing(true);
    try {
      if (studyMode === "due") {
        const result = await reviewWord(currentWord.id, rating);
        setReviewStates((old) => ({ ...old, [currentWord.id]: result.review }));
      }
      setStudyIndex(studyMode === "due" ? () => 0 : (old) => old + 1);
      setFlipped(false);
    } catch (error) {
      setNotice(`Không thể lưu kết quả ôn tập: ${errorText(error)}`);
    } finally {
      setReviewing(false);
    }
  };
  const importFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setNotice("Tệp nhập vượt quá giới hạn 10 MB.");
      return;
    }
    try {
      const result = await importWordsFile(
        JSON.parse(await file.text()) as unknown,
      );
      await loadWords();
      setNotice(
        `Đã nhập ${result.imported} từ; bỏ qua ${result.skipped} từ trùng.`,
      );
    } catch {
      setNotice("Không nhập được tệp. Hãy chọn JSON được xuất từ Lexicon.");
    }
  };
  const exportFile = async () => {
    try {
      await exportWordsFile();
    } catch {
      setNotice("Không thể xuất danh sách từ.");
    }
  };
  const requestSuggestion = async () => {
    if (!form.english.trim()) {
      setNotice("Nhập mục từ trước khi yêu cầu AI gợi ý.");
      return;
    }
    setSuggesting(true);
    try {
      const suggestion: WordSuggestion = await suggestWord(
        form.english,
        form.meaning,
        form.source,
        form.sourceLanguage,
        form.explanationLanguage,
        form.category,
      );
      setForm((old) => ({
        ...old,
        ...suggestion,
        wordFormsText: suggestion.wordForms
          .map(
            (item: WordForm) =>
              `${item.partOfSpeech} | ${item.form} | ${item.meaning}`,
          )
          .join("\n"),
        synonymsText: suggestion.synonyms.join(", "),
        antonymsText: suggestion.antonyms.join(", "),
        collocationsText: suggestion.collocations.join(", "),
      }));
      setNotice("AI đã điền gợi ý. Bạn có thể sửa mọi trường trước khi lưu.");
    } catch (error) {
      setNotice(`Không lấy được gợi ý AI: ${errorText(error)}`);
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="app-frame">
      <Sidebar
        count={words.length}
        due={dueWords.length}
        screen={screen}
        onLibrary={() => {
          setScreen("library");
          setSelected(null);
        }}
        onStudy={() => openStudy("due")}
        onDashboard={() => {
          setScreen("dashboard");
          setSelected(null);
        }}
        onSettings={() => {
          setScreen("settings");
          setSelected(null);
        }}
      />
      <main className="main-content">
        <header>
          <span>
            Lexicon /{" "}
            {selected
              ? selected.english
              : screen === "study"
                ? "Ôn tập"
                : screen === "dashboard"
                  ? "Tổng quan học tập"
                  : screen === "settings"
                    ? "Cài đặt AI"
                    : "Thư viện từ"}
          </span>
          <span className="account-chip">
            HA <span>Học viên</span>
          </span>
        </header>
        {notice && (
          <div className="toast">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}
        {screen === "settings" ? (
          <AiSettingsPage />
        ) : screen === "study" ? (
          <Study
            mode={studyMode}
            word={currentWord}
            total={studyWords.length}
            index={studyIndex}
            flipped={flipped}
            reviewing={reviewing}
            extraAvailable={extraWords.length > 0}
            weakAvailable={weakWords.length > 0}
            onExtraReview={() => openStudy("extra")}
            onWeakReview={() => openStudy("weak")}
            onFlip={() => setFlipped(!flipped)}
            onRate={rate}
          />
        ) : screen === "dashboard" ? (
          <Dashboard
            words={words}
            due={dueWords.length}
            reviewStates={reviewStates}
            onStudy={() => openStudy("due")}
            onLibrary={() => setScreen("library")}
          />
        ) : selected ? (
          <WordDetail
            word={selected}
            reviewState={reviewStates[selected.id]}
            onBack={() => setSelected(null)}
            onEdit={() => openEdit(selected)}
            onDelete={() => remove(selected)}
          />
        ) : (
          <Library
            words={visibleWords}
            total={words.length}
            categories={categories}
            query={query}
            category={category}
            sort={sort}
            loading={loading}
            onQuery={setQuery}
            onCategory={setCategory}
            onSort={setSort}
            onAdd={openAdd}
            onExport={exportFile}
            onImport={importFile}
            onOpen={setSelected}
            onRetry={loadWords}
            onEdit={openEdit}
            onDelete={remove}
          />
        )}
      </main>
      {modal && (
        <WordForm
          form={form}
          editing={editing !== null}
          saving={saving}
          suggesting={suggesting}
          onSuggest={requestSuggestion}
          onUpdate={update}
          onSave={save}
          onClose={() => !saving && setModal(false)}
        />
      )}
    </div>
  );
}

function Dashboard({
  words,
  due,
  reviewStates,
  onStudy,
  onLibrary,
}: {
  words: Word[];
  due: number;
  reviewStates: Record<number, ReviewState>;
  onStudy: () => void;
  onLibrary: () => void;
}) {
  const now = Date.now();
  const states = Object.values(reviewStates);
  const mastered = states.filter((state) => state.status === "mastered").length;
  const reviewedWeek = states.filter(
    (state) =>
      state.lastReviewedAt &&
      now - new Date(state.lastReviewedAt).getTime() <= 7 * 86400000,
  ).length;
  const attempts = states.reduce((sum, state) => sum + state.reviewCount, 0);
  const topics = [...new Set(words.map((word) => word.category || "Khác"))]
    .map((topic) => ({
      topic,
      count: words.filter((word) => (word.category || "Khác") === topic).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const recent = [...words].sort((a, b) => b.id - a.id).slice(0, 5);
  const completion = words.length
    ? Math.round((mastered / words.length) * 100)
    : 0;
  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Bức tranh học tập</p>
          <h1>Tổng quan</h1>
          <p className="muted">
            Tiến độ được tính từ dữ liệu ôn tập và từ vựng của bạn.
          </p>
        </div>
        <button className="primary" onClick={onStudy}>
          Bắt đầu ôn {due > 0 ? `(${due})` : ""} →
        </button>
      </div>
      <div className="stat-grid">
        <article className="stat-card">
          <span>Tổng từ đã lưu</span>
          <strong>{words.length}</strong>
          <small>Trong thư viện cá nhân</small>
        </article>
        <article className="stat-card stat-attention">
          <span>Đến hạn hôm nay</span>
          <strong>{due}</strong>
          <small>
            {due
              ? "Sẵn sàng cho lượt ôn tiếp theo"
              : "Bạn đã hoàn thành lượt ôn"}
          </small>
        </article>
        <article className="stat-card">
          <span>Đã thuộc</span>
          <strong>{mastered}</strong>
          <small>Từ đạt trạng thái thành thạo</small>
        </article>
        <article className="stat-card">
          <span>Đã ôn · 7 ngày</span>
          <strong>{reviewedWeek}</strong>
          <small>{attempts} lượt ôn tích lũy</small>
        </article>
      </div>
      <div className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Độ phủ ghi nhớ</h2>
              <p>Tỷ lệ từ đã chuyển sang trạng thái thành thạo</p>
            </div>
            <strong>{completion}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${completion}%` }} />
          </div>
          <div className="progress-caption">
            <span>{mastered} đã thuộc</span>
            <span>
              {Math.max(words.length - mastered, 0)} đang học hoặc chưa ôn
            </span>
          </div>
        </article>
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Chủ đề nổi bật</h2>
              <p>Phân bố từ theo chủ đề</p>
            </div>
            <button className="text-button" onClick={onLibrary}>
              Thư viện →
            </button>
          </div>
          {topics.length ? (
            <div className="topic-list">
              {topics.map(({ topic, count }) => (
                <div className="topic-row" key={topic}>
                  <span>{topic}</span>
                  <i>
                    <b
                      style={{
                        width: `${Math.max(8, Math.round((count / words.length) * 100))}%`,
                      }}
                    />
                  </i>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty">
              Thêm từ để xem thống kê theo chủ đề.
            </p>
          )}
        </article>
        <article className="dashboard-panel recent-panel">
          <div className="panel-heading">
            <div>
              <h2>Từ mới gần đây</h2>
              <p>Những mục gần nhất trong thư viện</p>
            </div>
            <button className="text-button" onClick={onLibrary}>
              Xem tất cả →
            </button>
          </div>
          {recent.length ? (
            recent.map((word) => (
              <button className="recent-word" key={word.id} onClick={onLibrary}>
                <span>
                  <b>{word.english}</b>
                  <small>{word.meaning}</small>
                </span>
                <em>{word.category}</em>
              </button>
            ))
          ) : (
            <p className="dashboard-empty">
              Chưa có dữ liệu. Hãy lưu từ đầu tiên.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string | undefined;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function WordForm({
  form,
  editing,
  saving,
  suggesting,
  onSuggest,
  onUpdate,
  onSave,
  onClose,
}: {
  form: FormState;
  editing: boolean;
  saving: boolean;
  suggesting: boolean;
  onSuggest: () => void;
  onUpdate: (field: keyof FormState, value: string) => void;
  onSave: (event: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal" onMouseDown={onClose}>
      <form
        className="word-form"
        onSubmit={onSave}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close" type="button" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">TOEIC vocabulary</p>
        <h2>{editing ? "Chỉnh sửa mục từ" : "Thêm từ vào thư viện"}</h2>
        <p className="form-help">
          Điền thủ công hoặc để AI gợi ý. Mọi nội dung luôn sửa được trước khi
          lưu.
        </p>
        <div className="form-section">
          <h3>Từ vựng chính</h3>
          <div className="suggest-row">
            <Field
              label="Từ tiếng Anh *"
              value={form.english}
              placeholder="acquire"
              onChange={(value) => onUpdate("english", value)}
            />
            <button
              className="ai-button"
              type="button"
              onClick={onSuggest}
              disabled={suggesting || !form.english.trim()}
            >
              {suggesting ? "Đang tạo gợi ý…" : "✦ Gợi ý bằng AI"}
            </button>
          </div>
          <div className="form-two-col">
            <Field
              label="Nghĩa tiếng Việt *"
              value={form.meaning}
              placeholder="đạt được, thu nhận"
              onChange={(value) => onUpdate("meaning", value)}
            />
            <Field
              label="Từ loại chính"
              value={form.partOfSpeech}
              placeholder="verb"
              onChange={(value) => onUpdate("partOfSpeech", value)}
            />
            <Field
              label="Phiên âm IPA"
              value={form.pronunciation}
              placeholder="/əˈkwaɪər/"
              onChange={(value) => onUpdate("pronunciation", value)}
            />
            <Field
              label="Ngữ cảnh học"
              value={form.context}
              placeholder="Hiring, finance, travel…"
              onChange={(value) => onUpdate("context", value)}
            />
          </div>
          <TextAreaField
            label="Ví dụ theo ngữ cảnh công việc"
            value={form.example}
            rows={2}
            placeholder="The company acquired a smaller competitor."
            onChange={(value) => onUpdate("example", value)}
          />
        </div>
        <div className="form-section">
          <h3>Họ từ và quan hệ nghĩa</h3>
          <TextAreaField
            label="Các từ loại liên quan · mỗi dòng: từ loại | từ | nghĩa"
            value={form.wordFormsText}
            rows={3}
            placeholder={
              "noun | acquisition | sự mua lại\nadjective | acquisitive | có tính thu nhận"
            }
            onChange={(value) => onUpdate("wordFormsText", value)}
          />
          <div className="form-two-col">
            <TextAreaField
              label="Từ đồng nghĩa · phân cách bằng dấu phẩy"
              value={form.synonymsText}
              rows={2}
              placeholder="obtain, gain, secure"
              onChange={(value) => onUpdate("synonymsText", value)}
            />
            <TextAreaField
              label="Từ trái nghĩa · phân cách bằng dấu phẩy"
              value={form.antonymsText}
              rows={2}
              placeholder="lose, forfeit"
              onChange={(value) => onUpdate("antonymsText", value)}
            />
          </div>
          <TextAreaField
            label="Cụm từ thường gặp"
            value={form.collocationsText}
            rows={2}
            placeholder="acquire a company, acquire skills"
            onChange={(value) => onUpdate("collocationsText", value)}
          />
        </div>
        <div className="form-section">
          <h3>Ghi chú cá nhân</h3>
          <div className="form-two-col">
            <Field
              label="Nguồn gặp từ"
              value={form.source}
              placeholder="Email, bài đọc, đề thi…"
              onChange={(value) => onUpdate("source", value)}
            />
            <Field
              label="Chủ đề cá nhân"
              value={form.category}
              placeholder="workplace"
              onChange={(value) => onUpdate("category", value)}
            />
          </div>
          <TextAreaField
            label="Ghi chú"
            value={form.notes}
            rows={2}
            placeholder="Ghi chú để nhớ cách dùng…"
            onChange={(value) => onUpdate("notes", value)}
          />
        </div>
        <div className="form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </button>
          <button className="primary" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu mục từ"}
          </button>
        </div>
      </form>
    </div>
  );
}
function TextAreaField({
  label,
  value,
  rows,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="textarea-field">
      {label}
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function Library({
  words,
  total,
  categories,
  query,
  category,
  sort,
  loading,
  onQuery,
  onCategory,
  onSort,
  onAdd,
  onExport,
  onImport,
  onOpen,
  onRetry,
  onEdit,
  onDelete,
}: {
  words: Word[];
  total: number;
  categories: string[];
  query: string;
  category: string;
  sort: string;
  loading: boolean;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onSort: (value: string) => void;
  onAdd: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onOpen: (word: Word) => void;
  onRetry: () => void;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
}) {
  return (
    <div className="page">
      <div className="heading">
        <div>
          <p className="eyebrow">Your personal dictionary</p>
          <h1>Những từ của bạn.</h1>
          <p className="muted">
            Tự tìm hiểu ở bất cứ đâu, rồi lưu lại để không quên.
          </p>
        </div>
        <div className="dictionary-actions">
          <button className="secondary-button" onClick={onExport}>
            Xuất JSON
          </button>
          <label className="secondary-button import-button">
            Nhập JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) onImport(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <button className="primary" onClick={onAdd}>
            ＋ Lưu từ mới
          </button>
        </div>
      </div>
      <div className="library-intro">
        <strong>{total}</strong>
        <span>từ đã tích lũy</span>
        <p>
          Mỗi từ bạn lưu lại là một mảnh ghép trong hành trình ngôn ngữ của
          riêng mình.
        </p>
      </div>
      <div className="toolbar">
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="⌕  Tìm từ, nghĩa, nguồn hoặc ghi chú..."
        />
        <select
          value={category}
          onChange={(event) => onCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "Tất cả chủ đề" : item}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => onSort(event.target.value)}>
          <option value="recent">Mới thêm trước</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
        <span>
          {words.length} / {total}
        </span>
      </div>
      {loading ? (
        <div className="empty">Đang tải từ điển...</div>
      ) : (
        <div className="library-grid">
          {words.map((word) => (
            <article key={word.id} onClick={() => onOpen(word)}>
              <div className="card-tools">
                <em>{word.category}</em>
                <span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(word);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(word);
                    }}
                  >
                    Xóa
                  </button>
                </span>
              </div>
              <h2>{word.english}</h2>
              <b>{word.meaning}</b>
              {word.source && <p className="source">Gặp ở: {word.source}</p>}
              <p>{word.example || "Chưa có câu ví dụ."}</p>
              {word.notes && <p className="notes">“{word.notes}”</p>}
              <small>Nhấn để xem chi tiết →</small>
            </article>
          ))}
        </div>
      )}
      {!loading && !words.length && (
        <div className="empty">
          {query || category !== "all"
            ? "Không tìm thấy từ phù hợp."
            : "Chưa có từ nào. Hãy lưu từ đầu tiên."}
          <br />
          <button
            className="primary"
            onClick={
              query || category !== "all"
                ? () => {
                    onQuery("");
                    onCategory("all");
                  }
                : onAdd
            }
          >
            {query || category !== "all" ? "Xem tất cả từ" : "Lưu từ đầu tiên"}
          </button>
        </div>
      )}
      {!loading && total === 0 && (
        <button className="retry-button" onClick={onRetry}>
          Tải lại dữ liệu
        </button>
      )}
    </div>
  );
}

function WordDetail({
  word,
  reviewState,
  onBack,
  onEdit,
  onDelete,
}: {
  word: Word;
  reviewState?: ReviewState;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusLabels: Record<string, string> = {
    learning: "Đang học",
    familiar: "Khá vững",
    mastered: "Đã thuộc",
  };
  const status = reviewState?.status ?? "new";
  const statusLabel = statusLabels[status] ?? "Mới lưu";
  return (
    <div className="page detail-page">
      <button className="back-button" onClick={onBack}>
        ← Thư viện từ
      </button>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">TOEIC vocabulary</p>
          <h1>{word.english}</h1>
          <p className="detail-meaning">{word.meaning}</p>
          <div className="word-meta">
            <span>{word.partOfSpeech || "Chưa rõ từ loại"}</span>
            {word.pronunciation && <span>{word.pronunciation}</span>}
            {(word.context || word.toeicContext) && (
              <span>{word.context || word.toeicContext}</span>
            )}
          </div>
        </div>
        <div className="detail-actions">
          <span
            className={`status ${status === "mastered" ? "mastered" : "new"}`}
          >
            {statusLabel}
          </span>
          <button className="primary" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button className="danger-button" onClick={onDelete}>
            Xóa
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <section className="detail-main">
          {word.wordForms.length > 0 && (
            <section className="detail-block">
              <h2>Họ từ</h2>
              <div className="word-family">
                {word.wordForms.map((item, index) => (
                  <div key={`${item.form}-${index}`}>
                    <span>{item.partOfSpeech}</span>
                    <strong>{item.form}</strong>
                    <small>{item.meaning}</small>
                  </div>
                ))}
              </div>
            </section>
          )}
          {word.synonyms.length > 0 && (
            <DetailBlock
              title="Từ đồng nghĩa"
              content={word.synonyms.join(" · ")}
            />
          )}
          {word.antonyms.length > 0 && (
            <DetailBlock
              title="Từ trái nghĩa"
              content={word.antonyms.join(" · ")}
            />
          )}
          {word.collocations.length > 0 && (
            <DetailBlock
              title="Cụm từ thường gặp"
              content={word.collocations.join(" · ")}
            />
          )}
          <DetailBlock
            title="Ví dụ TOEIC"
            content={
              word.example ||
              "Chưa có câu ví dụ. Hãy thêm một câu để ghi nhớ cách dùng."
            }
          />
          <DetailBlock
            title="Ngữ cảnh / nguồn"
            content={word.source || "Chưa ghi lại nguồn gặp từ."}
          />
          {word.notes && (
            <DetailBlock title="Ghi chú cá nhân" content={word.notes} />
          )}
        </section>
        <aside className="detail-side">
          <div>
            <small>Chủ đề cá nhân</small>
            <strong>{word.category}</strong>
          </div>
          <div>
            <small>Trạng thái học</small>
            <strong>{statusLabel}</strong>
          </div>
          <div>
            <small>Số lượt ôn</small>
            <strong>{reviewState?.reviewCount ?? 0}</strong>
          </div>
          <div>
            <small>Lần ôn tiếp theo</small>
            <strong>
              {reviewState
                ? new Date(reviewState.dueAt).toLocaleString()
                : "Khi bắt đầu ôn"}
            </strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
