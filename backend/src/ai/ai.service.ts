import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { SuggestWordDto } from './dto/suggest-word.dto';

const suggestionSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    meaning: { type: 'string' },
    example: { type: 'string' },
    partOfSpeech: { type: 'string' },
    pronunciation: { type: 'string' },
    wordForms: {
      type: 'array', items: { type: 'object', additionalProperties: false,
        properties: { partOfSpeech: { type: 'string' }, form: { type: 'string' }, meaning: { type: 'string' } },
        required: ['partOfSpeech', 'form', 'meaning'],
      },
    },
    synonyms: { type: 'array', items: { type: 'string' } },
    antonyms: { type: 'array', items: { type: 'string' } },
    collocations: { type: 'array', items: { type: 'string' } },
    toeicContext: { type: 'string' },
  },
  required: ['meaning', 'example', 'partOfSpeech', 'pronunciation', 'wordForms', 'synonyms', 'antonyms', 'collocations', 'toeicContext'],
};

@Injectable()
export class AiService {
  async suggestWord(dto: SuggestWordDto) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('AI chưa được cấu hình. Thêm OPENAI_API_KEY vào backend/.env để bật gợi ý.');

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-6-astra',
          input: [
            { role: 'system', content: 'You are a careful English–Vietnamese vocabulary editor for TOEIC learners. Return concise, commonly accepted information. Give common word-family forms with parts of speech, Vietnamese meanings, contextual synonyms and antonyms, natural business collocations, IPA pronunciation, and one short natural TOEIC-style workplace example. Do not invent an antonym if none is useful; return an empty list. The provided JSON schema is mandatory.' },
            { role: 'user', content: JSON.stringify({ english: dto.english.trim(), existingMeaning: dto.meaning?.trim() ?? '', sourceContext: dto.source?.trim() ?? '', targetLanguage: 'Vietnamese', exam: 'TOEIC' }) },
          ],
          text: { format: { type: 'json_schema', name: 'toeic_vocabulary_suggestion', strict: true, schema: suggestionSchema } },
          max_output_tokens: 1200,
        }),
      });
    } catch {
      throw new ServiceUnavailableException('Không kết nối được dịch vụ AI. Kiểm tra Internet rồi thử lại.');
    }

    const payload = await response.json().catch(() => ({})) as {
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      error?: { message?: string };
    };
    if (response.status === 401) throw new UnauthorizedException('OPENAI_API_KEY không hợp lệ hoặc chưa được cấp quyền.');
    if (!response.ok) throw new ServiceUnavailableException(payload.error?.message ?? `Dịch vụ AI trả về HTTP ${response.status}.`);

    const text = payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === 'output_text')?.text;
    if (!text) throw new ServiceUnavailableException('Dịch vụ AI không trả về nội dung gợi ý.');
    try { return JSON.parse(text); } catch { throw new ServiceUnavailableException('Dịch vụ AI trả về dữ liệu không hợp lệ.'); }
  }
}
