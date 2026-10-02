import Database from '@tauri-apps/plugin-sql';
import { suggestWordWithAi } from '../ai/aiService';

export type Word = {
  id: number;
  english: string;
  meaning: string;
  example: string;
  category: string;
  source: string;
  notes: string;
  lemma?: string;
  sourceLanguage?: string;
  explanationLanguage?: string;
  cefrLevel?: string;
  partOfSpeech?: string;
  register?: string;
  frequency?: string;
  tags?: string[];
  dateAdded?: string;
  pronunciation: string;
  pronunciationUS?: string;
  pronunciationUK?: string;
  syllables?: string;
  stressPattern?: string;
  etymology?: string;
  usageNotes?: string;
  wordForms: WordForm[];
  senses?: VocabularySense[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  grammarPatterns?: string[];
  learningGoals?: LearningGoal[];
  context: string;
  /** @deprecated Kept only to read exports from older app versions. */
  toeicContext?: string;
};

export type WordForm = { partOfSpeech: string; form: string; meaning: string };
export type VocabularySense = { definition: string; translation: string; examples: string[]; usageNotes: string };
export type LearningGoal = { name: string; level: string; notes: string };
export type WordSuggestion = Pick<Word, 'meaning' | 'example' | 'cefrLevel' | 'partOfSpeech' | 'register' | 'frequency' | 'pronunciation' | 'pronunciationUS' | 'pronunciationUK' | 'syllables' | 'stressPattern' | 'wordForms' | 'senses' | 'synonyms' | 'antonyms' | 'collocations' | 'grammarPatterns' | 'context'>;

export type WordInput = Omit<Word, 'id'>;
export type ReviewState = { wordId: number; status: string; dueAt: string; lastReviewedAt?: string | null; reviewCount: number; correctCount: number; incorrectCount: number; intervalDays: number };
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
export type WordTransferFile = { format: 'lexicon-words'; version: 1; exportedAt: string; words: Word[] };

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const isDesktop = () => '__TAURI_INTERNALS__' in window;
let databasePromise: Promise<Database> | undefined;

async function database(): Promise<Database> {
  if (!databasePromise) {
    databasePromise = Database.load('sqlite:lexicon.sqlite').then(async (db) => {
      await db.execute(`CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, english TEXT NOT NULL, meaning TEXT NOT NULL, example TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'general', source TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', lemma TEXT NOT NULL, sourceLanguage TEXT NOT NULL DEFAULT 'en', explanationLanguage TEXT NOT NULL DEFAULT 'vi', cefrLevel TEXT NOT NULL DEFAULT '', partOfSpeech TEXT NOT NULL DEFAULT '', register TEXT NOT NULL DEFAULT '', frequency TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]', dateAdded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, pronunciation TEXT NOT NULL DEFAULT '', pronunciationUS TEXT NOT NULL DEFAULT '', pronunciationUK TEXT NOT NULL DEFAULT '', syllables TEXT NOT NULL DEFAULT '', stressPattern TEXT NOT NULL DEFAULT '', etymology TEXT NOT NULL DEFAULT '', usageNotes TEXT NOT NULL DEFAULT '', wordForms TEXT NOT NULL DEFAULT '[]', senses TEXT NOT NULL DEFAULT '[]', synonyms TEXT NOT NULL DEFAULT '[]', antonyms TEXT NOT NULL DEFAULT '[]', collocations TEXT NOT NULL DEFAULT '[]', grammarPatterns TEXT NOT NULL DEFAULT '[]', learningGoals TEXT NOT NULL DEFAULT '[]', context TEXT NOT NULL DEFAULT '')`);
      const columns = await db.select<{ name: string }[]>(`PRAGMA table_info(words)`);
      const existingColumns = new Set(columns.map((column) => column.name));
      const newColumns = [
        ['pronunciation', "TEXT NOT NULL DEFAULT ''"], ['wordForms', "TEXT NOT NULL DEFAULT '[]'"],
        ['synonyms', "TEXT NOT NULL DEFAULT '[]'"], ['antonyms', "TEXT NOT NULL DEFAULT '[]'"],
        ['cefrLevel', "TEXT NOT NULL DEFAULT ''"], ['register', "TEXT NOT NULL DEFAULT ''"], ['frequency', "TEXT NOT NULL DEFAULT ''"],
        ['pronunciationUS', "TEXT NOT NULL DEFAULT ''"], ['pronunciationUK', "TEXT NOT NULL DEFAULT ''"], ['syllables', "TEXT NOT NULL DEFAULT ''"], ['stressPattern', "TEXT NOT NULL DEFAULT ''"], ['etymology', "TEXT NOT NULL DEFAULT ''"], ['usageNotes', "TEXT NOT NULL DEFAULT ''"],
        ['wordForms', "TEXT NOT NULL DEFAULT '[]'"], ['senses', "TEXT NOT NULL DEFAULT '[]'"], ['synonyms', "TEXT NOT NULL DEFAULT '[]'"], ['antonyms', "TEXT NOT NULL DEFAULT '[]'"], ['collocations', "TEXT NOT NULL DEFAULT '[]'"], ['grammarPatterns', "TEXT NOT NULL DEFAULT '[]'"], ['learningGoals', "TEXT NOT NULL DEFAULT '[]'"], ['context', "TEXT NOT NULL DEFAULT ''"],
      ];
      for (const [name, definition] of newColumns) {
        if (!existingColumns.has(name)) await db.execute(`ALTER TABLE words ADD COLUMN ${name} ${definition}`);
      }
      if (existingColumns.has('toeicContext') && !existingColumns.has('context')) await db.execute(`UPDATE words SET context = toeicContext`);
      await db.execute(`CREATE TABLE IF NOT EXISTS review_states (wordId INTEGER PRIMARY KEY, status TEXT NOT NULL DEFAULT 'new', dueAt TEXT NOT NULL, lastReviewedAt TEXT, reviewCount INTEGER NOT NULL DEFAULT 0, correctCount INTEGER NOT NULL DEFAULT 0, incorrectCount INTEGER NOT NULL DEFAULT 0, intervalDays INTEGER NOT NULL DEFAULT 0)`);
      await db.execute(`CREATE TABLE IF NOT EXISTS review_history (id INTEGER PRIMARY KEY AUTOINCREMENT, wordId INTEGER NOT NULL, rating TEXT NOT NULL, correct INTEGER NOT NULL, reviewedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, responseMs INTEGER)`);
      await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS words_english_lower ON words (lower(english))`);
      await db.execute(`CREATE INDEX IF NOT EXISTS review_states_due_at ON review_states (dueAt)`);
      await db.execute(`CREATE INDEX IF NOT EXISTS review_history_word_reviewed ON review_history (wordId, reviewedAt)`);
      return db;
    });
    databasePromise = databasePromise.catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

function parseWord(row: Record<string, unknown>): Word {
  const parseArray = <T,>(value: unknown, fallback: T[]): T[] => { try { const parsed = JSON.parse(String(value ?? '[]')); return Array.isArray(parsed) ? parsed as T[] : fallback; } catch { return fallback; } };
  const context = String(row.context ?? row.toeicContext ?? '');
  return { ...row, id: Number(row.id), english: String(row.english), meaning: String(row.meaning), example: String(row.example ?? ''), category: String(row.category ?? 'general'), source: String(row.source ?? ''), notes: String(row.notes ?? ''), cefrLevel: String(row.cefrLevel ?? ''), register: String(row.register ?? ''), frequency: String(row.frequency ?? ''), tags: parseArray<string>(row.tags, []), dateAdded: String(row.dateAdded ?? ''), pronunciation: String(row.pronunciation ?? ''), pronunciationUS: String(row.pronunciationUS ?? ''), pronunciationUK: String(row.pronunciationUK ?? ''), syllables: String(row.syllables ?? ''), stressPattern: String(row.stressPattern ?? ''), etymology: String(row.etymology ?? ''), usageNotes: String(row.usageNotes ?? ''), wordForms: parseArray<WordForm>(row.wordForms, []), senses: parseArray<VocabularySense>(row.senses, []), synonyms: parseArray<string>(row.synonyms, []), antonyms: parseArray<string>(row.antonyms, []), collocations: parseArray<string>(row.collocations, []), grammarPatterns: parseArray<string>(row.grammarPatterns, []), learningGoals: parseArray<LearningGoal>(row.learningGoals, []), context, toeicContext: context } as Word;
}

export async function suggestWord(term: string, meaning = '', source = '', sourceLanguage = 'en', explanationLanguage = 'vi', learningGoal = ''): Promise<WordSuggestion> {
  return suggestWordWithAi({ term, meaning, source, sourceLanguage, explanationLanguage, learningGoal });
}

export async function listWords(): Promise<Word[]> {
  if (!isDesktop()) {
    const response = await fetch(`${API}/words`);
    if (!response.ok) throw new Error(`Loading words failed: ${response.status}`);
    return response.json();
  }
  const rows = await (await database()).select<Record<string, unknown>[]>(`SELECT * FROM words ORDER BY id ASC`);
  return rows.map(parseWord);
}

export async function exportWordsFile(): Promise<void> {
  const file: WordTransferFile = { format: 'lexicon-words', version: 1, exportedAt: new Date().toISOString(), words: await listWords() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lexicon-words-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importWordsFile(file: unknown): Promise<{ imported: number; skipped: number }> {
  if (!file || typeof file !== 'object') throw new Error('Invalid vocabulary file');
  const candidate = file as Partial<WordTransferFile>;
  if (candidate.format !== 'lexicon-words' || candidate.version !== 1 || !Array.isArray(candidate.words)) {
    throw new Error('Unsupported vocabulary file format');
  }
  if (candidate.words.some((item) => {
    if (!item || typeof item.english !== 'string' || typeof item.meaning !== 'string' || !item.english.trim() || !item.meaning.trim()) return true;
    const textFields = [item.example, item.category, item.source, item.notes, item.lemma, item.sourceLanguage, item.explanationLanguage, item.partOfSpeech];
    return textFields.some((value) => value !== undefined && typeof value !== 'string')
      || (item.tags !== undefined && (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== 'string')));
  })) {
    throw new Error('The vocabulary file contains invalid word data');
  }

  const existing = await listWords();
  const spellings = new Set(existing.map((word) => word.english.trim().toLocaleLowerCase()));
  let imported = 0;
  let skipped = 0;
  for (const item of candidate.words) {
    const spelling = item.english.trim().toLocaleLowerCase();
    if (spellings.has(spelling)) {
      skipped += 1;
      continue;
    }
    const { id: _id, ...input } = item;
    await saveWord({
      english: input.english.trim(), meaning: input.meaning.trim(), example: input.example ?? '',
      category: input.category || 'general', source: input.source ?? '', notes: input.notes ?? '',
      lemma: input.lemma, sourceLanguage: input.sourceLanguage, explanationLanguage: input.explanationLanguage,
      partOfSpeech: input.partOfSpeech, tags: input.tags, pronunciation: input.pronunciation,
      wordForms: input.wordForms, synonyms: input.synonyms, antonyms: input.antonyms,
      collocations: input.collocations, context: input.context ?? input.toeicContext,
    });
    spellings.add(spelling);
    imported += 1;
  }
  return { imported, skipped };
}

export async function saveWord(input: WordInput, id?: number): Promise<Word> {
  if (!isDesktop()) {
    const response = await fetch(`${API}/words${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApiWordPayload(input)),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as { message?: string | string[] };
      const message = Array.isArray(error.message) ? error.message.join('; ') : error.message;
      throw new Error(message ? `Không thể lưu (HTTP ${response.status}): ${message}` : `Không thể lưu (HTTP ${response.status}).`);
    }
    return response.json();
  }
  const db = await database();
  const values = [input.english.trim(), input.meaning.trim(), input.example?.trim() ?? '', input.category?.trim() || 'general', input.source?.trim() ?? '', input.notes?.trim() ?? '', input.lemma?.trim() || input.english.trim(), input.sourceLanguage?.trim() || 'en', input.explanationLanguage?.trim() || 'vi', input.cefrLevel?.trim() ?? '', input.partOfSpeech?.trim() ?? '', input.register?.trim() ?? '', input.frequency?.trim() ?? '', JSON.stringify(input.tags ?? []), input.pronunciation?.trim() ?? '', input.pronunciationUS?.trim() ?? '', input.pronunciationUK?.trim() ?? '', input.syllables?.trim() ?? '', input.stressPattern?.trim() ?? '', input.etymology?.trim() ?? '', input.usageNotes?.trim() ?? '', JSON.stringify(input.wordForms ?? []), JSON.stringify(input.senses ?? []), JSON.stringify(input.synonyms ?? []), JSON.stringify(input.antonyms ?? []), JSON.stringify(input.collocations ?? []), JSON.stringify(input.grammarPatterns ?? []), JSON.stringify(input.learningGoals ?? []), (input.context ?? input.toeicContext)?.trim() ?? ''];
  let savedId = id;
  if (id) {
    await db.execute(`UPDATE words SET english=?, meaning=?, example=?, category=?, source=?, notes=?, lemma=?, sourceLanguage=?, explanationLanguage=?, cefrLevel=?, partOfSpeech=?, register=?, frequency=?, tags=?, pronunciation=?, pronunciationUS=?, pronunciationUK=?, syllables=?, stressPattern=?, etymology=?, usageNotes=?, wordForms=?, senses=?, synonyms=?, antonyms=?, collocations=?, grammarPatterns=?, learningGoals=?, context=? WHERE id=?`, [...values, id]);
  } else {
    const result = await db.execute(`INSERT INTO words (english, meaning, example, category, source, notes, lemma, sourceLanguage, explanationLanguage, cefrLevel, partOfSpeech, register, frequency, tags, pronunciation, pronunciationUS, pronunciationUK, syllables, stressPattern, etymology, usageNotes, wordForms, senses, synonyms, antonyms, collocations, grammarPatterns, learningGoals, context) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values);
    savedId = result.lastInsertId;
  }
  if (savedId === undefined) throw new Error('The database did not return the saved word id');
  const rows = await db.select<Record<string, unknown>[]>(`SELECT * FROM words WHERE id = ?`, [savedId]);
  if (!rows[0]) throw new Error(`Saved word ${savedId} could not be loaded`);
  return parseWord(rows[0]);
}

/** Send only fields accepted by the backend DTO; UI and legacy fields never cross the API boundary. */
function toApiWordPayload(input: WordInput) {
  return {
    english: input.english,
    meaning: input.meaning,
    example: input.example,
    category: input.category,
    source: input.source,
    notes: input.notes,
    lemma: input.lemma,
    sourceLanguage: input.sourceLanguage,
    explanationLanguage: input.explanationLanguage,
    cefrLevel: input.cefrLevel,
    partOfSpeech: input.partOfSpeech,
    register: input.register,
    frequency: input.frequency,
    tags: input.tags,
    pronunciation: input.pronunciation,
    pronunciationUS: input.pronunciationUS,
    pronunciationUK: input.pronunciationUK,
    syllables: input.syllables,
    stressPattern: input.stressPattern,
    etymology: input.etymology,
    usageNotes: input.usageNotes,
    wordForms: input.wordForms,
    senses: input.senses,
    synonyms: input.synonyms,
    antonyms: input.antonyms,
    collocations: input.collocations,
    grammarPatterns: input.grammarPatterns,
    learningGoals: input.learningGoals,
    context: input.context ?? input.toeicContext,
  };
}

export async function deleteWord(id: number): Promise<void> {
  if (!isDesktop()) { const response = await fetch(`${API}/words/${id}`, { method: 'DELETE' }); if (!response.ok) throw new Error(`Delete failed: ${response.status}`); return; }
  const db = await database();
  await db.execute(`DELETE FROM review_history WHERE wordId = ?`, [id]);
  await db.execute(`DELETE FROM review_states WHERE wordId = ?`, [id]);
  await db.execute(`DELETE FROM words WHERE id = ?`, [id]);
}

export async function reviewStates(): Promise<ReviewState[]> {
  if (!isDesktop()) {
    const response = await fetch(`${API}/reviews/states`);
    if (!response.ok) throw new Error(`Loading review states failed: ${response.status}`);
    return response.json();
  }
  return (await (await database()).select<Record<string, unknown>[]>(`SELECT * FROM review_states`)).map((row) => ({ wordId: Number(row.wordId), status: String(row.status), dueAt: String(row.dueAt), lastReviewedAt: row.lastReviewedAt == null ? null : String(row.lastReviewedAt), reviewCount: Number(row.reviewCount), correctCount: Number(row.correctCount), incorrectCount: Number(row.incorrectCount), intervalDays: Number(row.intervalDays) }));
}

export async function reviewWord(wordId: number, rating: ReviewRating): Promise<{ review: ReviewState }> {
  if (!isDesktop()) { const response = await fetch(`${API}/reviews/${wordId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating }) }); if (!response.ok) throw new Error(`Review failed: ${response.status}`); return response.json(); }
  const db = await database(); const old = (await db.select<Record<string, unknown>[]>(`SELECT * FROM review_states WHERE wordId = ?`, [wordId]))[0];
  const currentInterval = Number(old?.intervalDays ?? 0);
  const correct = rating !== 'again';
  const multiplier = rating === 'hard' ? 1 : rating === 'good' ? 2 : 4;
  const intervalDays = correct ? Math.max(1, currentInterval ? currentInterval * multiplier : multiplier) : 0;
  const status = rating === 'easy' && intervalDays >= 30 ? 'mastered' : intervalDays >= 7 ? 'familiar' : 'learning';
  const dueAt = new Date(Date.now() + (correct ? intervalDays * 86400000 : 10 * 60 * 1000)).toISOString();
  await db.execute(`INSERT INTO review_states (wordId, status, dueAt, lastReviewedAt, reviewCount, correctCount, incorrectCount, intervalDays) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 1, ?, ?, ?) ON CONFLICT(wordId) DO UPDATE SET status=excluded.status, dueAt=excluded.dueAt, lastReviewedAt=CURRENT_TIMESTAMP, reviewCount=review_states.reviewCount+1, correctCount=review_states.correctCount+excluded.correctCount, incorrectCount=review_states.incorrectCount+excluded.incorrectCount, intervalDays=excluded.intervalDays`, [wordId, status, dueAt, rating === 'easy' ? 1 : 0, rating === 'again' ? 1 : 0, intervalDays]);
  await db.execute(`INSERT INTO review_history (wordId, rating, correct) VALUES (?, ?, ?)`, [wordId, rating, correct ? 1 : 0]);
  const state = (await reviewStates()).find((item) => item.wordId === wordId);
  if (!state) throw new Error(`Review state for word ${wordId} was not saved`);
  return { review: state };
}
