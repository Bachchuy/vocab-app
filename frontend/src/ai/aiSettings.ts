import { invoke } from '@tauri-apps/api/core';

const browserSessionKey = 'lexicon.ai.gemini.api-key';
const isDesktop = () => '__TAURI_INTERNALS__' in window;

export async function hasAiApiKey(): Promise<boolean> {
  return isDesktop() ? invoke<boolean>('has_ai_api_key') : Boolean(sessionStorage.getItem(browserSessionKey));
}

export async function getAiApiKey(): Promise<string | null> {
  return isDesktop() ? invoke<string | null>('get_ai_api_key') : sessionStorage.getItem(browserSessionKey);
}

export async function saveAiApiKey(apiKey: string): Promise<void> {
  if (isDesktop()) await invoke('save_ai_api_key', { key: apiKey });
  else sessionStorage.setItem(browserSessionKey, apiKey.trim());
}

export async function deleteAiApiKey(): Promise<void> {
  if (isDesktop()) await invoke('delete_ai_api_key');
  else sessionStorage.removeItem(browserSessionKey);
}
