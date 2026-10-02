export type AiProviderId = 'gemini';

export type WordSuggestionInput = {
  term: string;
  meaning?: string;
  source?: string;
  sourceLanguage: string;
  explanationLanguage: string;
  learningGoal: string;
};

export type AiStructuredRequest = {
  system: string;
  input: unknown;
  schema?: unknown;
  maxOutputTokens: number;
};

/** Feature code depends on this contract, not a vendor-specific API shape. */
export interface AiProvider {
  readonly id: AiProviderId;
  readonly displayName: string;
  testConnection(apiKey: string): Promise<void>;
  generateStructured(apiKey: string, request: AiStructuredRequest): Promise<unknown>;
}
