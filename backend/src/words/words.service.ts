import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordsRepository } from './words.repository';

@Injectable()
export class WordsService {
  constructor(private readonly wordsRepository: WordsRepository) {}

  findAll(): Promise<Word[]> { return this.wordsRepository.findAll(); }

  async findOne(id: number): Promise<Word> {
    const word = await this.wordsRepository.findById(id);
    if (!word) throw new NotFoundException(`Word with id ${id} not found`);
    return word;
  }

  async create(dto: CreateWordDto): Promise<Word> {
    const english = dto.english?.trim(); const meaning = dto.meaning?.trim();
    if (!english || !meaning) throw new BadRequestException('english and meaning are required');
    if (await this.wordsRepository.findByEnglish(english)) throw new ConflictException(`Word "${english}" already exists`);
    return this.wordsRepository.create({ ...dto, english, meaning });
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word> {
    const english = dto.english?.trim(); const meaning = dto.meaning?.trim();
    if (dto.english !== undefined && !english) throw new BadRequestException('english cannot be empty');
    if (dto.meaning !== undefined && !meaning) throw new BadRequestException('meaning cannot be empty');
    if (english && await this.wordsRepository.findByEnglish(english, id)) throw new ConflictException(`Word "${english}" already exists`);
    const word = await this.wordsRepository.update(id, { ...dto, ...(english !== undefined && { english }), ...(meaning !== undefined && { meaning }) });
    if (!word) throw new NotFoundException(`Word with id ${id} not found`);
    return word;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.wordsRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Word with id ${id} not found`);
    return true;
  }
}
