import { Body, Controller, Post } from '@nestjs/common';
import { SuggestWordDto } from './dto/suggest-word.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  suggestWord(@Body() dto: SuggestWordDto) {
    return this.aiService.suggestWord(dto);
  }
}
