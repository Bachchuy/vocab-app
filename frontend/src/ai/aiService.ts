import type { WordSuggestionInput } from './contracts';
import { suggestWord } from './features/word-suggestions';
import { activeProviderId, getAiProvider } from './providerRegistry';
import type { WordSuggestion } from '../services/vocabularyStore';

export async function testAiKey(apiKey: string): Promise<void> {
  await getAiProvider(activeProviderId).testConnection(apiKey);
}

export async function suggestWordWithAi(input: WordSuggestionInput): Promise<WordSuggestion> {
  return suggestWord(input);
}
