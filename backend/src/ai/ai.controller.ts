import { Body, Controller, Post } from '@nestjs/common';
import { SuggestWordDto } from './features/word-suggestions/suggest-word.dto';
import { SuggestWordUseCase } from './features/word-suggestions/suggest-word.use-case';

@Controller('ai')
export class AiController {
  constructor(private readonly suggestWordUseCase: SuggestWordUseCase) {}

  @Post('suggest')
  suggestWord(@Body() dto: SuggestWordDto) {
    return this.suggestWordUseCase.execute(dto);
  }
}
