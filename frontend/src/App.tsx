import { useEffect, useMemo, useState } from 'react';
import { deleteWord, exportWordsFile, importWordsFile, listWords, reviewStates as loadReviewStates, reviewWord, saveWord, type ReviewState, type ReviewRating, type Word } from './services/vocabularyStore';

type FormState = Omit<Word, 'id'>;
type Rating = ReviewRating;
const blank: FormState = { english: '', meaning: '', example: '', category: 'general', source: '', notes: '' };

export default function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [screen, setScreen] = useState<'library' | 'study'>('library');
  const [selected, setSelected] = useState<Word | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState<FormState>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewStates, setReviewStates] = useState<Record<number, ReviewState>>({});

  const loadWords = async () => { setLoading(true); try { const [loadedWords, states] = await Promise.all([listWords(), loadReviewStates()]); setWords(loadedWords); setReviewStates(Object.fromEntries(states.map((state) => [state.wordId, state]))); } catch { setNotice('Không thể tải từ điển. Kiểm tra backend rồi thử lại.'); } finally { setLoading(false); } };
  useEffect(() => { void loadWords(); }, []); useEffect(() => { if (selected) setSelected(words.find((word) => word.id === selected.id) ?? null); }, [words]);
  const categories = useMemo(() => ['all', ...new Set(words.map((word) => word.category))], [words]);
  const visibleWords = useMemo(() => [...words.filter((word) => `${word.english} ${word.meaning} ${word.example} ${word.source} ${word.notes}`.toLowerCase().includes(query.toLowerCase()) && (category === 'all' || word.category === category))].sort((a, b) => sort === 'az' ? a.english.localeCompare(b.english) : sort === 'za' ? b.english.localeCompare(a.english) : b.id - a.id), [words, query, category, sort]);
  const now = Date.now();
  const dueWords = words.filter((word) => {
    const state = reviewStates[word.id];
    return !state || (state.status !== 'mastered' && new Date(state.dueAt).getTime() <= now);
  });
  const currentWord = dueWords[studyIndex % Math.max(dueWords.length, 1)];
  const update = (field: keyof FormState, value: string) => setForm((old) => ({ ...old, [field]: value }));
  const openAdd = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = (word: Word) => { setEditing(word.id); setForm({ english: word.english, meaning: word.meaning, example: word.example, category: word.category, source: word.source, notes: word.notes }); setModal(true); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); if (!form.english.trim() || !form.meaning.trim()) { setNotice('Hãy nhập từ và nghĩa của từ.'); return; } setSaving(true); try { await saveWord(form, editing ?? undefined); setModal(false); setForm(blank); setNotice(editing ? 'Đã cập nhật mục từ.' : 'Đã lưu từ vào từ điển.'); await loadWords(); } catch { setNotice('Không thể lưu thay đổi.'); } finally { setSaving(false); } };
  const remove = async (word: Word) => { if (!window.confirm(`Xóa “${word.english}” khỏi từ điển?`)) return; try { await deleteWord(word.id); setSelected(null); setNotice(`Đã xóa “${word.english}”.`); await loadWords(); } catch { setNotice('Không thể xóa mục từ.'); } };
  const openStudy = () => { setScreen('study'); setSelected(null); setStudyIndex(0); setFlipped(false); };
  const rate = async (rating: Rating) => {
    if (!currentWord || reviewing) return;
    setReviewing(true);
    try {
      const result = await reviewWord(currentWord.id, rating);
      setReviewStates((old) => ({ ...old, [currentWord.id]: result.review }));
      setStudyIndex(0);
      setFlipped(false);
    } catch {
      setNotice('Không thể lưu kết quả ôn tập.');
    } finally {
      setReviewing(false);
    }
  };
  const importFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setNotice('Tệp nhập vượt quá giới hạn 10 MB.');
      return;
    }
    try {
      const result = await importWordsFile(JSON.parse(await file.text()) as unknown);
      await loadWords();
      setNotice(`Đã nhập ${result.imported} từ; bỏ qua ${result.skipped} từ trùng.`);
    } catch {
      setNotice('Không nhập được tệp. Hãy chọn JSON được xuất từ Lexicon.');
    }
  };
  const exportFile = async () => {
    try { await exportWordsFile(); } catch { setNotice('Không thể xuất danh sách từ.'); }
  };

  return <div className="app-frame"><Sidebar count={words.length} due={dueWords.length} screen={screen} onLibrary={() => { setScreen('library'); setSelected(null); }} onStudy={openStudy} onNotice={setNotice} /><main><header><span>Lexicon / {selected ? selected.english : screen === 'study' ? 'Ôn lại từ đã lưu' : 'Từ điển cá nhân'}</span><button>HA &nbsp; Học viên⌄</button></header>{notice && <div className="toast">{notice}<button onClick={() => setNotice('')}>×</button></div>}{screen === 'study' ? <Study word={currentWord} total={dueWords.length} index={studyIndex} flipped={flipped} reviewing={reviewing} onFlip={() => setFlipped(!flipped)} onRate={rate} /> : selected ? <WordDetail word={selected} reviewState={reviewStates[selected.id]} onBack={() => setSelected(null)} onEdit={() => openEdit(selected)} onDelete={() => remove(selected)} /> : <Library words={visibleWords} total={words.length} categories={categories} query={query} category={category} sort={sort} loading={loading} onQuery={setQuery} onCategory={setCategory} onSort={setSort} onAdd={openAdd} onExport={exportFile} onImport={importFile} onOpen={setSelected} onRetry={loadWords} onEdit={openEdit} onDelete={remove} />}</main>{modal && <WordForm form={form} editing={editing !== null} saving={saving} onUpdate={update} onSave={save} onClose={() => !saving && setModal(false)} />}</div>;
}

function Sidebar({ count, due, screen, onLibrary, onStudy, onNotice }: { count: number; due: number; screen: string; onLibrary: () => void; onStudy: () => void; onNotice: (text: string) => void }) { return <aside className="sidebar"><div className="brand"><span className="brand-mark">V</span>Lexicon</div><div className="profile"><span className="avatar">HA</span><div><b>Từ điển cá nhân</b><small>{count} từ đã lưu</small></div></div><nav><p>Kho từ của tôi</p><button className={screen === 'library' ? 'active' : ''} onClick={onLibrary}>▤ Thư viện từ</button><button onClick={() => onNotice('Tổng quan sẽ được mở rộng sau detail page.')}>⌂ Tổng quan</button><button className={screen === 'study' ? 'active' : ''} onClick={onStudy}>◉ Ôn lại từ đã lưu <b>{due}</b></button><p>Cá nhân</p><button onClick={() => onNotice('Thống kê chi tiết đang được chuẩn bị.')}>↗ Tiến độ</button></nav><div className="sidebar-footer">✦ <span><b>Kho từ của riêng bạn</b><small>Tự chọn, tự tích lũy</small></span></div></aside>; }
function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) { return <label>{label}<input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
function WordForm({ form, editing, saving, onUpdate, onSave, onClose }: { form: FormState; editing: boolean; saving: boolean; onUpdate: (field: keyof FormState, value: string) => void; onSave: (event: React.FormEvent) => void; onClose: () => void }) { return <div className="modal" onMouseDown={onClose}><form onSubmit={onSave} onMouseDown={(event) => event.stopPropagation()}><button className="close" type="button" onClick={onClose}>×</button><p className="eyebrow">Personal dictionary</p><h2>{editing ? 'Chỉnh sửa mục từ' : 'Lưu từ mới'}</h2><p className="form-help">Ghi lại từ bạn gặp ở bất kỳ đâu.</p><Field label="Từ tiếng Anh" value={form.english} placeholder="resilient" onChange={(value) => onUpdate('english', value)} /><Field label="Nghĩa tiếng Việt" value={form.meaning} placeholder="kiên cường" onChange={(value) => onUpdate('meaning', value)} /><Field label="Bạn gặp từ này ở đâu?" value={form.source} placeholder="Sách, phim, lớp học..." onChange={(value) => onUpdate('source', value)} /><Field label="Chủ đề" value={form.category} placeholder="general" onChange={(value) => onUpdate('category', value)} /><label>Câu ví dụ<textarea rows={3} value={form.example} onChange={(event) => onUpdate('example', event.target.value)} /></label><label>Ghi chú cá nhân<textarea rows={2} value={form.notes} onChange={(event) => onUpdate('notes', event.target.value)} /></label><button className="primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu vào từ điển →'}</button></form></div>; }
function Library({ words, total, categories, query, category, sort, loading, onQuery, onCategory, onSort, onAdd, onExport, onImport, onOpen, onRetry, onEdit, onDelete }: { words: Word[]; total: number; categories: string[]; query: string; category: string; sort: string; loading: boolean; onQuery: (value: string) => void; onCategory: (value: string) => void; onSort: (value: string) => void; onAdd: () => void; onExport: () => void; onImport: (file: File) => void; onOpen: (word: Word) => void; onRetry: () => void; onEdit: (word: Word) => void; onDelete: (word: Word) => void }) {
  return <div className="page"><div className="heading"><div><p className="eyebrow">Your personal dictionary</p><h1>Những từ của bạn.</h1><p className="muted">Tự tìm hiểu ở bất cứ đâu, rồi lưu lại để không quên.</p></div><div className="dictionary-actions"><button className="secondary-button" onClick={onExport}>Xuất JSON</button><label className="secondary-button import-button">Nhập JSON<input type="file" accept="application/json,.json" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) onImport(file); event.currentTarget.value = ''; }} /></label><button className="primary" onClick={onAdd}>＋ Lưu từ mới</button></div></div><div className="library-intro"><strong>{total}</strong><span>từ đã tích lũy</span><p>Mỗi từ bạn lưu lại là một mảnh ghép trong hành trình ngôn ngữ của riêng mình.</p></div><div className="toolbar"><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="⌕  Tìm từ, nghĩa, nguồn hoặc ghi chú..." /><select value={category} onChange={(event) => onCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'Tất cả chủ đề' : item}</option>)}</select><select value={sort} onChange={(event) => onSort(event.target.value)}><option value="recent">Mới thêm trước</option><option value="az">A → Z</option><option value="za">Z → A</option></select><span>{words.length} / {total}</span></div>{loading ? <div className="empty">Đang tải từ điển...</div> : <div className="library-grid">{words.map((word) => <article key={word.id} onClick={() => onOpen(word)}><div className="card-tools"><em>{word.category}</em><span><button onClick={(event) => { event.stopPropagation(); onEdit(word); }}>Sửa</button><button onClick={(event) => { event.stopPropagation(); onDelete(word); }}>Xóa</button></span></div><h2>{word.english}</h2><b>{word.meaning}</b>{word.source && <p className="source">Gặp ở: {word.source}</p>}<p>{word.example || 'Chưa có câu ví dụ.'}</p>{word.notes && <p className="notes">“{word.notes}”</p>}<small>Nhấn để xem chi tiết →</small></article>)}</div>}{!loading && !words.length && <div className="empty">{query || category !== 'all' ? 'Không tìm thấy từ phù hợp.' : 'Chưa có từ nào. Hãy lưu từ đầu tiên.'}<br /><button className="primary" onClick={query || category !== 'all' ? () => { onQuery(''); onCategory('all'); } : onAdd}>{query || category !== 'all' ? 'Xem tất cả từ' : 'Lưu từ đầu tiên'}</button></div>}{!loading && total === 0 && <button className="retry-button" onClick={onRetry}>Tải lại dữ liệu</button>}</div>;
}
function WordDetail({ word, reviewState, onBack, onEdit, onDelete }: { word: Word; reviewState?: ReviewState; onBack: () => void; onEdit: () => void; onDelete: () => void }) {
  const statusLabels: Record<string, string> = { learning: 'Đang học', familiar: 'Khá vững', mastered: 'Đã thuộc' };
  const status = reviewState?.status ?? 'new';
  const statusLabel = statusLabels[status] ?? 'Mới lưu';
  return <div className="page detail-page"><button className="back-button" onClick={onBack}>← Thư viện từ</button><div className="detail-heading"><div><p className="eyebrow">Vocabulary entry</p><h1>{word.english}</h1><p className="detail-meaning">{word.meaning}</p></div><div className="detail-actions"><span className={`status ${status === 'mastered' ? 'mastered' : 'new'}`}>{statusLabel}</span><button className="primary" onClick={onEdit}>Chỉnh sửa</button><button className="danger-button" onClick={onDelete}>Xóa</button></div></div><div className="detail-grid"><section className="detail-main"><DetailBlock title="Câu ví dụ" content={word.example || 'Chưa có câu ví dụ. Hãy thêm một câu để ghi nhớ cách dùng.'} /><DetailBlock title="Ngữ cảnh / nguồn" content={word.source || 'Chưa ghi lại nguồn gặp từ.'} /><DetailBlock title="Ghi chú cá nhân" content={word.notes || 'Chưa có ghi chú cá nhân.'} /></section><aside className="detail-side"><div><small>Chủ đề</small><strong>{word.category}</strong></div><div><small>Trạng thái học</small><strong>{statusLabel}</strong></div><div><small>Số lượt ôn</small><strong>{reviewState?.reviewCount ?? 0}</strong></div><div><small>Lần ôn tiếp theo</small><strong>{reviewState ? new Date(reviewState.dueAt).toLocaleString() : 'Khi bắt đầu ôn'}</strong></div></aside></div></div>;
}
function DetailBlock({ title, content }: { title: string; content: string }) { return <section className="detail-block"><h2>{title}</h2><p>{content}</p></section>; }
function Study({ word, total, index, flipped, reviewing, onFlip, onRate }: { word?: Word; total: number; index: number; flipped: boolean; reviewing: boolean; onFlip: () => void; onRate: (rating: Rating) => void }) { return <div className="page study"><div className="heading"><div><p className="eyebrow">Review your collection</p><h1>Ôn lại từ đã lưu</h1><p className="muted">Chỉ ôn những từ đã đến hạn.</p></div><strong>{total ? Math.min(index + 1, total) : 0} / {total}</strong></div>{word ? <><div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={onFlip}><div><small>English word</small><strong>{word.english}</strong><em>Nhấn để lật thẻ</em></div><div><small>Meaning</small><strong>{word.meaning}</strong><p>{word.example || 'Bạn chưa thêm ví dụ cho từ này.'}</p></div></div><p className="question">Bạn nhớ từ này đến đâu?</p><div className="ratings"><button disabled={reviewing} onClick={() => onRate('again')}>↻ <b>Chưa nhớ</b><small>10 phút</small></button><button disabled={reviewing} onClick={() => onRate('hard')}>• <b>Khó</b><small>1 ngày</small></button><button disabled={reviewing} onClick={() => onRate('good')}>✓ <b>Được</b><small>2 ngày</small></button><button disabled={reviewing} onClick={() => onRate('easy')}>✦ <b>Dễ</b><small>4 ngày</small></button></div></> : <div className="finished"><h2>✦<br />Không còn từ đến hạn!</h2><p>Các từ đã lên lịch sẽ xuất hiện ở lần ôn tiếp theo.</p></div>}</div>; }
