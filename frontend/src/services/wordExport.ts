import type { Word } from "./vocabularyStore";

const columns: Array<{ header: string; value: (word: Word) => string }> = [
  { header: "Từ", value: (word) => word.english },
  { header: "Lemma", value: (word) => word.lemma ?? "" },
  { header: "Nghĩa", value: (word) => word.meaning },
  { header: "Ngôn ngữ nguồn", value: (word) => word.sourceLanguage ?? "" },
  { header: "Ngôn ngữ giải thích", value: (word) => word.explanationLanguage ?? "" },
  { header: "Từ loại", value: (word) => word.partOfSpeech ?? "" },
  { header: "Văn phong", value: (word) => word.register ?? "" },
  { header: "Tần suất", value: (word) => word.frequency ?? "" },
  { header: "Phiên âm", value: (word) => word.pronunciation ?? "" },
  { header: "Phiên âm US", value: (word) => word.pronunciationUS ?? "" },
  { header: "Phiên âm UK", value: (word) => word.pronunciationUK ?? "" },
  { header: "Số âm tiết", value: (word) => word.syllables ?? "" },
  { header: "Trọng âm", value: (word) => word.stressPattern ?? "" },
  { header: "CEFR", value: (word) => word.cefrLevel ?? "" },
  { header: "Ví dụ", value: (word) => word.example },
  { header: "Ngữ cảnh", value: (word) => word.context ?? word.toeicContext ?? "" },
  { header: "Nguồn", value: (word) => word.source },
  { header: "Chủ đề", value: (word) => word.category },
  { header: "Thẻ", value: (word) => (word.tags ?? []).join("; ") },
  {
    header: "Các nghĩa",
    value: (word) =>
      (word.senses ?? [])
        .map((sense) => [sense.translation, sense.definition].filter(Boolean).join(": "))
        .join("\n"),
  },
  {
    header: "Họ từ",
    value: (word) =>
      (word.wordForms ?? [])
        .map((form) => [form.partOfSpeech, form.form, form.meaning].filter(Boolean).join(" | "))
        .join("\n"),
  },
  { header: "Từ đồng nghĩa", value: (word) => (word.synonyms ?? []).join("; ") },
  { header: "Từ trái nghĩa", value: (word) => (word.antonyms ?? []).join("; ") },
  { header: "Collocations", value: (word) => (word.collocations ?? []).join("; ") },
  { header: "Mẫu ngữ pháp", value: (word) => (word.grammarPatterns ?? []).join("; ") },
  { header: "Ghi chú cách dùng", value: (word) => word.usageNotes ?? "" },
  { header: "Từ nguyên", value: (word) => word.etymology ?? "" },
  {
    header: "Mục tiêu học",
    value: (word) =>
      (word.learningGoals ?? [])
        .map((goal) => [goal.name, goal.level, goal.notes].filter(Boolean).join(" | "))
        .join("\n"),
  },
  { header: "Ghi chú cá nhân", value: (word) => word.notes },
  { header: "Ngày thêm", value: (word) => word.dateAdded ?? "" },
];

/** Build a human-readable workbook; JSON remains the full-fidelity backup format. */
export async function exportWordsSpreadsheet(words: readonly Word[]): Promise<void> {
  if (!words.length) throw new Error("Hãy chọn ít nhất một từ để xuất.");
  // Load the workbook writer only when a user asks for an Excel export.
  const XLSX = await import("xlsx");

  const rows = words.map((word) => columns.map(({ value }) => value(word)));
  const worksheet = XLSX.utils.aoa_to_sheet([
    columns.map(({ header }) => header),
    ...rows,
  ]);
  worksheet["!cols"] = columns.map(({ header }) => ({ wch: Math.min(Math.max(header.length + 4, 14), 32) }));
  if (worksheet["!ref"]) worksheet["!autofilter"] = { ref: worksheet["!ref"] };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Từ vựng");
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `lexicon-tu-vung-${date}.xlsx`, { compression: true });
}
