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
    let wordForms: { partOfSpeech: string; form: string; meaning: string }[] = [];
    let synonyms: string[] = [];
    let antonyms: string[] = [];
    let collocations: string[] = [];
    try { tags = JSON.parse(word.tags) as string[]; } catch { tags = []; }
    try { wordForms = JSON.parse(word.wordForms) as typeof wordForms; } catch { wordForms = []; }
    try { synonyms = JSON.parse(word.synonyms) as string[]; } catch { synonyms = []; }
    try { antonyms = JSON.parse(word.antonyms) as string[]; } catch { antonyms = []; }
    try { collocations = JSON.parse(word.collocations) as string[]; } catch { collocations = []; }
    return new Word(word.id, word.english, word.meaning, word.example, word.category, word.source, word.notes, word.lemma, word.sourceLanguage, word.explanationLanguage, word.partOfSpeech, tags, word.dateAdded.toISOString(), word.pronunciation, wordForms, synonyms, antonyms, collocations, word.toeicContext);
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
      english: dto.english.trim(), meaning: dto.meaning.trim(), example: dto.example?.trim() ?? '', category: dto.category?.trim() ?? 'general', source: dto.source?.trim() ?? '', notes: dto.notes?.trim() ?? '', lemma: dto.lemma?.trim() || dto.english.trim(), sourceLanguage: dto.sourceLanguage?.trim() ?? 'en', explanationLanguage: dto.explanationLanguage?.trim() ?? 'vi', partOfSpeech: dto.partOfSpeech?.trim() ?? '', tags: JSON.stringify(dto.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []), pronunciation: dto.pronunciation?.trim() ?? '', wordForms: JSON.stringify(dto.wordForms ?? []), synonyms: JSON.stringify(dto.synonyms?.map((value) => value.trim()).filter(Boolean) ?? []), antonyms: JSON.stringify(dto.antonyms?.map((value) => value.trim()).filter(Boolean) ?? []), collocations: JSON.stringify(dto.collocations?.map((value) => value.trim()).filter(Boolean) ?? []), toeicContext: dto.toeicContext?.trim() ?? '',
    } });
    return this.toEntity(word);
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word | undefined> {
    try {
      const word = await this.prisma.word.update({ where: { id }, data: {
        ...(dto.english !== undefined && { english: dto.english.trim() }), ...(dto.meaning !== undefined && { meaning: dto.meaning.trim() }), ...(dto.example !== undefined && { example: dto.example.trim() }), ...(dto.category !== undefined && { category: dto.category.trim() }), ...(dto.source !== undefined && { source: dto.source.trim() }), ...(dto.notes !== undefined && { notes: dto.notes.trim() }), ...(dto.lemma !== undefined && { lemma: dto.lemma.trim() }), ...(dto.sourceLanguage !== undefined && { sourceLanguage: dto.sourceLanguage.trim() }), ...(dto.explanationLanguage !== undefined && { explanationLanguage: dto.explanationLanguage.trim() }), ...(dto.partOfSpeech !== undefined && { partOfSpeech: dto.partOfSpeech.trim() }), ...(dto.tags !== undefined && { tags: JSON.stringify(dto.tags.map((tag) => tag.trim()).filter(Boolean)) }), ...(dto.pronunciation !== undefined && { pronunciation: dto.pronunciation.trim() }), ...(dto.wordForms !== undefined && { wordForms: JSON.stringify(dto.wordForms) }), ...(dto.synonyms !== undefined && { synonyms: JSON.stringify(dto.synonyms.map((value) => value.trim()).filter(Boolean)) }), ...(dto.antonyms !== undefined && { antonyms: JSON.stringify(dto.antonyms.map((value) => value.trim()).filter(Boolean)) }), ...(dto.collocations !== undefined && { collocations: JSON.stringify(dto.collocations.map((value) => value.trim()).filter(Boolean)) }), ...(dto.toeicContext !== undefined && { toeicContext: dto.toeicContext.trim() }),
      } });
      return this.toEntity(word);
    } catch { return undefined; }
  }

  async delete(id: number): Promise<boolean> {
    try { await this.prisma.word.delete({ where: { id } }); return true; } catch { return false; }
  }
}
