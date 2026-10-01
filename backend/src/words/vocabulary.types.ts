export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CefrLevel = typeof CEFR_LEVELS[number];

export type VocabularySense = {
  definition: string;
  translation: string;
  examples: string[];
  usageNotes: string;
};

export type WordForm = {
  partOfSpeech: string;
  form: string;
  meaning: string;
};

export type LearningGoal = {
  name: string;
  level: string;
  notes: string;
};

export type WordProps = {
  id: number;
  term: string;
  meaning: string;
  example: string;
  category: string;
  source: string;
  notes: string;
  lemma: string;
  sourceLanguage: string;
  explanationLanguage: string;
  cefrLevel: CefrLevel | '';
  partOfSpeech: string;
  register: string;
  frequency: string;
  pronunciation: string;
  pronunciationUS: string;
  pronunciationUK: string;
  syllables: string;
  stressPattern: string;
  etymology: string;
  usageNotes: string;
  tags: string[];
  dateAdded: string;
  wordForms: WordForm[];
  senses: VocabularySense[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  grammarPatterns: string[];
  learningGoals: LearningGoal[];
  context: string;
};
