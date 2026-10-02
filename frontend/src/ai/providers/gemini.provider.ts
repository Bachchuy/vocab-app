import type { AiProvider, AiStructuredRequest } from '../contracts';

const MODEL = 'gemini-3.1-flash-lite';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string; status?: string };
};

export class GeminiProvider implements AiProvider {
  readonly id = 'gemini' as const;
  readonly displayName = 'Google Gemini';

  async testConnection(apiKey: string): Promise<void> {
    await this.generateStructured(apiKey, {
      system: 'Reply with the single word OK.',
      input: 'Connection test',
      maxOutputTokens: 8,
    });
  }

  async generateStructured(apiKey: string, request: AiStructuredRequest): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: request.system }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(request.input) }] }],
          generationConfig: request.schema
            ? { maxOutputTokens: request.maxOutputTokens, responseMimeType: 'application/json', responseSchema: toGeminiSchema(request.schema) }
            : { maxOutputTokens: request.maxOutputTokens },
        }),
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') throw new Error('AI phản hồi quá lâu. Hãy thử lại.');
      throw new Error('Không kết nối được Google Gemini. Kiểm tra Internet rồi thử lại.');
    }

    const payload = await response.json().catch(() => null) as GeminiResponse | null;
    if (response.status === 401 || response.status === 403) {
      throw new Error('API key không hợp lệ hoặc chưa được cấp quyền Gemini API.');
    }
    if (response.status === 429) throw new Error('Bạn đã chạm giới hạn miễn phí của Gemini. Hãy thử lại sau.');
    if (!response.ok) throw new Error(payload?.error?.message ?? `Gemini trả về lỗi HTTP ${response.status}.`);

    const text = payload?.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).find((part) => part.text)?.text;
    if (!text) throw new Error('Gemini không trả về nội dung. Hãy thử lại.');
    try { return request.schema ? JSON.parse(text) as unknown : text; }
    catch { throw new Error('Gemini trả dữ liệu không đúng định dạng. Hãy thử lại.'); }
  }
}

function toGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toGeminiSchema);
  if (!value || typeof value !== 'object') return value;
  const schema = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(schema).map(([key, child]) => [
    key,
    key === 'type' && typeof child === 'string' ? child.toUpperCase() : toGeminiSchema(child),
  ]));
}
