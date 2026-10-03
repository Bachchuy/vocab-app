import type { ReviewRating, Word } from "../services/vocabularyStore";

export type FormState = Omit<
  Word,
  "id" | "wordForms" | "synonyms" | "antonyms" | "collocations" | "toeicContext"
> & {
  lemma: string;
  sourceLanguage: string;
  explanationLanguage: string;
  partOfSpeech: string;
  wordFormsText: string;
  synonymsText: string;
  antonymsText: string;
  collocationsText: string;
};

export type Rating = ReviewRating;

export const blankForm: FormState = {
  english: "",
  meaning: "",
  detailedExplanation: "",
  example: "",
  category: "general",
  source: "",
  notes: "",
  lemma: "",
  sourceLanguage: "en",
  explanationLanguage: "vi",
  partOfSpeech: "",
  tags: [],
  pronunciation: "",
  wordFormsText: "",
  synonymsText: "",
  antonymsText: "",
  collocationsText: "",
  context: "",
};
