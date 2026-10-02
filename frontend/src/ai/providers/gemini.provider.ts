import type { AiProvider, AiStructuredRequest } from '../contracts';

const MODEL = 'gemini-3.1-flash-lite';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  error?: { message?: string; status?: string };
};

export class GeminiProvider implements AiProvider {
  readonly id = 'gemini' as const;
  readonly displayName = 'Google Gemini';

  async testConnection(apiKey: string): Promise<void> {
    const result = await this.generateStructured(apiKey, {
      system: 'Reply with the single word OK.',
      input: 'Connection test',
      maxOutputTokens: 8,
    });
    if (typeof result !== 'string' || !result.trim()) {
      throw new Error('Gemini đã nhận yêu cầu nhưng không trả nội dung.');
    }
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
            ? {
                maxOutputTokens: request.maxOutputTokens,
                // This is a protobuf enum in the current REST responseFormat API.
                responseFormat: { text: { mimeType: 'APPLICATION_JSON', schema: request.schema } },
              }
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

    // Gemini 3 may include thought summaries as separate text parts before the answer.
    // Never parse those as the structured result.
    const text = payload?.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .filter((part) => !part.thought && typeof part.text === 'string')
      .map((part) => part.text)
      .join('');
    if (!text) throw new Error('Gemini không trả về nội dung kết quả. Hãy thử lại.');
    try { return request.schema ? parseJsonOutput(text) : text; }
    catch { throw new Error('Gemini trả dữ liệu không đúng định dạng. Hãy thử lại.'); }
  }
}

function parseJsonOutput(text: string): unknown {
  const normalized = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  try { return JSON.parse(normalized) as unknown; } catch { /* Try extracting a JSON value from surrounding model text. */ }

  const objectStart = normalized.indexOf('{');
  const arrayStart = normalized.indexOf('[');
  const start = objectStart < 0 ? arrayStart : arrayStart < 0 ? objectStart : Math.min(objectStart, arrayStart);
  const objectEnd = normalized.lastIndexOf('}');
  const arrayEnd = normalized.lastIndexOf(']');
  const end = Math.max(objectEnd, arrayEnd);
  if (start < 0 || end <= start) throw new Error('No JSON value returned');
  return JSON.parse(normalized.slice(start, end + 1)) as unknown;
}
