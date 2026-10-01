import { ServiceUnavailableException } from '@nestjs/common';

export type WordSuggestion = {
  meaning: string;
  example: string;
  cefrLevel: string;
  partOfSpeech: string;
  register: string;
  frequency: string;
  pronunciation: string;
  pronunciationUS: string;
  pronunciationUK: string;
  syllables: string;
  stressPattern: string;
  wordForms: Array<{ partOfSpeech: string; form: string; meaning: string }>;
  senses: Array<{ definition: string; translation: string; examples: string[]; usageNotes: string }>;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  grammarPatterns: string[];
  context: string;
};

/** Validate at the trust boundary; structured output reduces, but does not remove, this need. */
export function validateWordSuggestion(value: unknown): WordSuggestion {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalidSuggestion();

  const item = value as Record<string, unknown>;
  const limits = {
    meaning: 200,
    example: 500,
    cefrLevel: 2,
    partOfSpeech: 50,
    register: 30,
    frequency: 30,
    pronunciation: 80,
    pronunciationUS: 80,
    pronunciationUK: 80,
    syllables: 50,
    stressPattern: 80,
    context: 200,
  } as const;
  for (const [key, maxLength] of Object.entries(limits)) {
    const text = item[key];
    if (typeof text !== 'string' || text.length > maxLength) invalidSuggestion();
  }
  if (!(item.meaning as string).trim()) invalidSuggestion();
  if (item.cefrLevel !== '' && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(item.cefrLevel as string)) invalidSuggestion();

  const list = (key: 'synonyms' | 'antonyms' | 'collocations' | 'grammarPatterns', maxLength: number): string[] => {
    const values = item[key];
    if (
      !Array.isArray(values) ||
      values.length > 30 ||
      values.some((entry) => typeof entry !== 'string' || entry.length > maxLength)
    ) invalidSuggestion();
    return (values as string[]).map((entry) => entry.trim()).filter(Boolean);
  };

  if (!Array.isArray(item.wordForms) || item.wordForms.length > 20) invalidSuggestion();
  const wordForms = (item.wordForms as unknown[]).map((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) invalidSuggestion();
    const form = entry as Record<string, unknown>;
    if (
      typeof form.partOfSpeech !== 'string' || form.partOfSpeech.length > 30 ||
      typeof form.form !== 'string' || form.form.length > 100 ||
      typeof form.meaning !== 'string' || form.meaning.length > 200
    ) invalidSuggestion();
    return {
      partOfSpeech: (form.partOfSpeech as string).trim(),
      form: (form.form as string).trim(),
      meaning: (form.meaning as string).trim(),
    };
  });

  if (!Array.isArray(item.senses) || item.senses.length > 20) invalidSuggestion();
  const senses = (item.senses as unknown[]).map((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) invalidSuggestion();
    const sense = entry as Record<string, unknown>;
    if (typeof sense.definition !== 'string' || sense.definition.length > 300 || typeof sense.translation !== 'string' || sense.translation.length > 300 || typeof sense.usageNotes !== 'string' || sense.usageNotes.length > 300 || !Array.isArray(sense.examples) || sense.examples.length > 5 || sense.examples.some((example) => typeof example !== 'string' || example.length > 500)) invalidSuggestion();
    return { definition: sense.definition.trim(), translation: sense.translation.trim(), examples: (sense.examples as string[]).map((example) => example.trim()).filter(Boolean), usageNotes: sense.usageNotes.trim() };
  });

  return {
    meaning: (item.meaning as string).trim(),
    example: (item.example as string).trim(),
    cefrLevel: (item.cefrLevel as string).trim(),
    partOfSpeech: (item.partOfSpeech as string).trim(),
    register: (item.register as string).trim(),
    frequency: (item.frequency as string).trim(),
    pronunciation: (item.pronunciation as string).trim(),
    pronunciationUS: (item.pronunciationUS as string).trim(),
    pronunciationUK: (item.pronunciationUK as string).trim(),
    syllables: (item.syllables as string).trim(),
    stressPattern: (item.stressPattern as string).trim(),
    wordForms,
    senses,
    synonyms: list('synonyms', 100),
    antonyms: list('antonyms', 100),
    collocations: list('collocations', 200),
    grammarPatterns: list('grammarPatterns', 200),
    context: (item.context as string).trim(),
  };
}

function invalidSuggestion(): never {
  throw new ServiceUnavailableException('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
}
