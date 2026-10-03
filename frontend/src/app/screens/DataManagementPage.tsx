import { useMemo, useState } from "react";
import type { Word } from "../../services/vocabularyStore";
import "./data-management.css";

type DataManagementPageProps = {
  words: Word[];
  loading: boolean;
  onImport: (file: File) => void;
  onExportJson: () => void;
  onExportSpreadsheet: (words: Word[]) => Promise<void>;
};

export function DataManagementPage({
  words,
  loading,
  onImport,
  onExportJson,
  onExportSpreadsheet,
}: DataManagementPageProps) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [exporting, setExporting] = useState(false);
  const filteredWords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return words;
    return words.filter((word) =>
      `${word.english} ${word.meaning} ${word.category} ${word.source}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [words, query]);

  const toggleWord = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectVisible = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const word of filteredWords) next.add(word.id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());
  const selectedWords = words.filter((word) => selectedIds.has(word.id));
  const exportSelected = async () => {
    setExporting(true);
    try {
      await onExportSpreadsheet(selectedWords);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="page data-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Quản lý thư viện</p>
          <h1>Dữ liệu từ vựng</h1>
          <p className="muted">
            Nhập bản sao lưu JSON hoặc chọn những từ cần đưa vào bảng tính Excel.
          </p>
        </div>
      </div>

      <div className="data-actions-grid">
        <article className="data-card">
          <div className="data-card-heading">
            <span className="data-icon">&#123; &#125;</span>
            <div>
              <h2>Sao lưu JSON</h2>
              <p>Giữ nguyên dữ liệu để chuyển sang Lexicon hoặc nhập lại sau.</p>
            </div>
          </div>
          <div className="data-actions">
            <button className="secondary-button" onClick={onExportJson}>
              Xuất toàn bộ JSON
            </button>
            <label className="secondary-button import-button">
              Nhập file JSON
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
          </div>
          <p className="data-footnote">
            Khi nhập, từ trùng sẽ được bỏ qua; dữ liệu hiện có không bị ghi đè.
          </p>
        </article>

        <article className="data-card spreadsheet-card">
          <div className="data-card-heading">
            <span className="data-icon spreadsheet-icon">▦</span>
            <div>
              <h2>Xuất bảng tính Excel</h2>
              <p>Chọn từng từ hoặc chọn tất cả kết quả đang hiển thị.</p>
            </div>
          </div>

          <div className="data-selection-toolbar">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm từ, nghĩa, chủ đề hoặc nguồn..."
              aria-label="Tìm từ để xuất"
            />
            <button className="text-button" onClick={selectVisible} disabled={!filteredWords.length}>
              Chọn kết quả ({filteredWords.length})
            </button>
            <button className="text-button" onClick={clearSelection} disabled={!selectedIds.size}>
              Bỏ chọn
            </button>
          </div>

          <div className="data-word-list" aria-label="Danh sách từ xuất Excel">
            {loading ? (
              <p className="empty">Đang tải từ điển...</p>
            ) : filteredWords.length ? (
              filteredWords.map((word) => (
                <label className="data-word-row" key={word.id}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(word.id)}
                    onChange={() => toggleWord(word.id)}
                  />
                  <span className="data-word-copy">
                    <strong>{word.english}</strong>
                    <span>{word.meaning}</span>
                  </span>
                  <small>{word.category || "Khác"}</small>
                </label>
              ))
            ) : (
              <p className="empty">
                {words.length ? "Không tìm thấy từ phù hợp." : "Từ điển chưa có từ nào."}
              </p>
            )}
          </div>

          <div className="data-export-footer">
            <span>Đã chọn {selectedWords.length} / {words.length} từ</span>
            <button
              className="primary"
              onClick={() => void exportSelected()}
              disabled={loading || exporting || !selectedWords.length}
            >
              {exporting ? "Đang tạo file..." : "Xuất Excel (.xlsx)"}
            </button>
          </div>
          <p className="data-footnote">
            Bảng tính gồm các trường từ vựng; lịch sử ôn và API key không được xuất.
            Dùng JSON để sao lưu dữ liệu Lexicon đầy đủ.
          </p>
        </article>
      </div>
    </section>
  );
}
