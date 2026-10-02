import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { AiProvider, StructuredGenerationRequest } from '../contracts/ai-provider';

type OpenAiResponse = {
  status?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
};

/** OpenAI Responses API adapter. Feature prompts and validation stay outside this class. */
@Injectable()
export class OpenAiResponsesProvider implements AiProvider {
  async generateStructured(request: StructuredGenerationRequest): Promise<unknown> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI chưa được cấu hình. Thêm OPENAI_API_KEY vào backend/.env để bật gợi ý.',
      );
    }

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
          store: false,
          input: [
            { role: 'system', content: request.instructions },
            { role: 'user', content: JSON.stringify(request.input) },
          ],
          text: {
            format: {
              type: 'json_schema',
              name: request.schemaName,
              strict: true,
              schema: request.schema,
            },
          },
          max_output_tokens: request.maxOutputTokens,
        }),
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ServiceUnavailableException('AI phản hồi quá lâu. Vui lòng thử lại.');
      }
      throw new ServiceUnavailableException(
        'Không kết nối được dịch vụ AI. Kiểm tra kết nối mạng rồi thử lại.',
      );
    }

    const payload = (await response.json().catch(() => null)) as OpenAiResponse | null;
    if (response.status === 401) {
      throw new UnauthorizedException('OPENAI_API_KEY không hợp lệ hoặc chưa được cấp quyền.');
    }
    if (response.status === 429) {
      throw new ServiceUnavailableException(
        'Dịch vụ AI đang quá tải hoặc đã hết hạn mức. Vui lòng thử lại sau.',
      );
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Dịch vụ AI hiện không thể xử lý yêu cầu (HTTP ${response.status}).`,
      );
    }
    if (!payload || payload.status === 'incomplete') {
      throw new ServiceUnavailableException('AI chưa hoàn tất nội dung. Vui lòng thử lại.');
    }

    const text = payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === 'output_text')?.text;
    if (!text) throw new ServiceUnavailableException('AI không trả về nội dung. Vui lòng thử lại.');

    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new ServiceUnavailableException('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
    }
  }
}

