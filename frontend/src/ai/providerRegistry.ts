import type { AiProvider, AiProviderId } from './contracts';
import { GeminiProvider } from './providers/gemini.provider';

// Feature use cases depend on AiProvider, so swapping an API vendor stays at this boundary.
const providers: Record<AiProviderId, AiProvider> = {
  gemini: new GeminiProvider(),
};

// Centralized default. A future settings control can persist this choice instead.
export const activeProviderId: AiProviderId = 'gemini';

export function getAiProvider(id: AiProviderId): AiProvider {
  return providers[id];
}
