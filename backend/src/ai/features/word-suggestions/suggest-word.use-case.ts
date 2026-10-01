import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER, AiProvider } from '../../contracts/ai-provider';
import { SuggestWordDto } from './suggest-word.dto';
import { wordSuggestionInstructions } from './word-suggestion.prompt';
import { wordSuggestionSchema } from './word-suggestion.schema';
import { validateWordSuggestion } from './word-suggestion.validator';

@Injectable()
export class SuggestWordUseCase {
  constructor(@Inject(AI_PROVIDER) private readonly aiProvider: AiProvider) {}

  async execute(dto: SuggestWordDto) {
    const english = dto.english?.trim();
    if (!english) throw new BadRequestException('Hãy nhập từ tiếng Anh cần gợi ý.');

    const result = await this.aiProvider.generateStructured({
      instructions: wordSuggestionInstructions,
      input: {
        english,
        existingMeaning: dto.meaning?.trim() ?? '',
        sourceContext: dto.source?.trim() ?? '',
        targetLanguage: 'Vietnamese',
        exam: 'TOEIC',
      },
      schemaName: 'toeic_vocabulary_suggestion',
      schema: wordSuggestionSchema,
      maxOutputTokens: 1200,
    });

    return validateWordSuggestion(result);
  }
}
