import { ServiceUnavailableException } from '@nestjs/common';

export type WordSuggestion = {
  meaning: string;
  example: string;
  partOfSpeech: string;
  pronunciation: string;
  wordForms: Array<{ partOfSpeech: string; form: string; meaning: string }>;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  toeicContext: string;
};

/** Validate at the trust boundary; structured output reduces, but does not remove, this need. */
export function validateWordSuggestion(value: unknown): WordSuggestion {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalidSuggestion();

  const item = value as Record<string, unknown>;
  const limits = {
    meaning: 200,
    example: 500,
    partOfSpeech: 50,
    pronunciation: 80,
    toeicContext: 200,
  } as const;
  for (const [key, maxLength] of Object.entries(limits)) {
    const text = item[key];
    if (typeof text !== 'string' || text.length > maxLength) invalidSuggestion();
  }
  if (!(item.meaning as string).trim()) invalidSuggestion();

  const list = (key: 'synonyms' | 'antonyms' | 'collocations', maxLength: number): string[] => {
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

  return {
    meaning: (item.meaning as string).trim(),
    example: (item.example as string).trim(),
    partOfSpeech: (item.partOfSpeech as string).trim(),
    pronunciation: (item.pronunciation as string).trim(),
    wordForms,
    synonyms: list('synonyms', 100),
    antonyms: list('antonyms', 100),
    collocations: list('collocations', 200),
    toeicContext: (item.toeicContext as string).trim(),
  };
}

function invalidSuggestion(): never {
  throw new ServiceUnavailableException('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
}
