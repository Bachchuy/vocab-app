import { Injectable } from '@nestjs/common';
import { Word as PrismaWord } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

type StoredWord = PrismaWord;

@Injectable()
export class WordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(word: StoredWord): Word {
    let tags: string[] = [];
    try { tags = JSON.parse(word.tags) as string[]; } catch { tags = []; }
    return new Word(word.id, word.english, word.meaning, word.example, word.category, word.source, word.notes, word.lemma, word.sourceLanguage, word.explanationLanguage, word.partOfSpeech, tags, word.dateAdded.toISOString());
  }

  async findAll(): Promise<Word[]> {
    const words = await this.prisma.word.findMany({ orderBy: { id: 'asc' } });
    return words.map((word) => this.toEntity(word));
  }

  async findById(id: number): Promise<Word | undefined> {
    const word = await this.prisma.word.findUnique({ where: { id } });
    return word ? this.toEntity(word) : undefined;
  }

  async findByEnglish(english: string, excludedId?: number): Promise<Word | undefined> {
    const words = await this.prisma.word.findMany({ where: excludedId ? { id: { not: excludedId } } : undefined });
    const match = words.find((word) => word.english.toLocaleLowerCase() === english.trim().toLocaleLowerCase());
    return match ? this.toEntity(match) : undefined;
  }

  async create(dto: CreateWordDto): Promise<Word> {
    const word = await this.prisma.word.create({ data: {
      english: dto.english.trim(), meaning: dto.meaning.trim(), example: dto.example?.trim() ?? '', category: dto.category?.trim() ?? 'general', source: dto.source?.trim() ?? '', notes: dto.notes?.trim() ?? '', lemma: dto.lemma?.trim() || dto.english.trim(), sourceLanguage: dto.sourceLanguage?.trim() ?? 'en', explanationLanguage: dto.explanationLanguage?.trim() ?? 'vi', partOfSpeech: dto.partOfSpeech?.trim() ?? '', tags: JSON.stringify(dto.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []),
    } });
    return this.toEntity(word);
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word | undefined> {
    try {
      const word = await this.prisma.word.update({ where: { id }, data: {
        ...(dto.english !== undefined && { english: dto.english.trim() }), ...(dto.meaning !== undefined && { meaning: dto.meaning.trim() }), ...(dto.example !== undefined && { example: dto.example.trim() }), ...(dto.category !== undefined && { category: dto.category.trim() }), ...(dto.source !== undefined && { source: dto.source.trim() }), ...(dto.notes !== undefined && { notes: dto.notes.trim() }), ...(dto.lemma !== undefined && { lemma: dto.lemma.trim() }), ...(dto.sourceLanguage !== undefined && { sourceLanguage: dto.sourceLanguage.trim() }), ...(dto.explanationLanguage !== undefined && { explanationLanguage: dto.explanationLanguage.trim() }), ...(dto.partOfSpeech !== undefined && { partOfSpeech: dto.partOfSpeech.trim() }), ...(dto.tags !== undefined && { tags: JSON.stringify(dto.tags.map((tag) => tag.trim()).filter(Boolean)) }),
      } });
      return this.toEntity(word);
    } catch { return undefined; }
  }

  async delete(id: number): Promise<boolean> {
    try { await this.prisma.word.delete({ where: { id } }); return true; } catch { return false; }
  }
}
