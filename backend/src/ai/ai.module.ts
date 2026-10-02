import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AI_PROVIDER } from './contracts/ai-provider';
import { SuggestWordUseCase } from './features/word-suggestions/suggest-word.use-case';
import { OpenAiResponsesProvider } from './providers/openai-responses.provider';

@Module({
  controllers: [AiController],
  providers: [
    SuggestWordUseCase,
    OpenAiResponsesProvider,
    { provide: AI_PROVIDER, useExisting: OpenAiResponsesProvider },
  ],
})
export class AiModule {}
