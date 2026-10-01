import { Injectable } from '@nestjs/common';
import { Word as PrismaWord } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { LearningGoal, VocabularySense, WordForm, WordProps } from './vocabulary.types';

type StoredWord = PrismaWord;

@Injectable()
export class WordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(word: StoredWord): Word {
    const parse = <T>(value: string, fallback: T): T => {
      try { return JSON.parse(value) as T; } catch { return fallback; }
    };
    const props: WordProps = {
      id: word.id,
      term: word.english,
      meaning: word.meaning,
      example: word.example,
      category: word.category,
      source: word.source,
      notes: word.notes,
      lemma: word.lemma,
      sourceLanguage: word.sourceLanguage,
      explanationLanguage: word.explanationLanguage,
      cefrLevel: word.cefrLevel as WordProps['cefrLevel'],
      partOfSpeech: word.partOfSpeech,
      register: word.register,
      frequency: word.frequency,
      pronunciation: word.pronunciation,
      pronunciationUS: word.pronunciationUS,
      pronunciationUK: word.pronunciationUK,
      syllables: word.syllables,
      stressPattern: word.stressPattern,
      etymology: word.etymology,
      usageNotes: word.usageNotes,
      tags: parse<string[]>(word.tags, []),
      dateAdded: word.dateAdded.toISOString(),
      wordForms: parse<WordForm[]>(word.wordForms, []),
      senses: parse<VocabularySense[]>(word.senses, []),
      synonyms: parse<string[]>(word.synonyms, []),
      antonyms: parse<string[]>(word.antonyms, []),
      collocations: parse<string[]>(word.collocations, []),
      grammarPatterns: parse<string[]>(word.grammarPatterns, []),
      learningGoals: parse<LearningGoal[]>(word.learningGoals, []),
      context: word.context,
    };
    return new Word(props);
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
      english: dto.english.trim(), meaning: dto.meaning.trim(), example: dto.example?.trim() ?? '', category: dto.category?.trim() ?? 'general', source: dto.source?.trim() ?? '', notes: dto.notes?.trim() ?? '', lemma: dto.lemma?.trim() || dto.english.trim(), sourceLanguage: dto.sourceLanguage?.trim() ?? 'en', explanationLanguage: dto.explanationLanguage?.trim() ?? 'vi', cefrLevel: dto.cefrLevel?.trim() ?? '', partOfSpeech: dto.partOfSpeech?.trim() ?? '', register: dto.register?.trim() ?? '', frequency: dto.frequency?.trim() ?? '', tags: JSON.stringify(dto.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []), pronunciation: dto.pronunciation?.trim() ?? '', pronunciationUS: dto.pronunciationUS?.trim() ?? '', pronunciationUK: dto.pronunciationUK?.trim() ?? '', syllables: dto.syllables?.trim() ?? '', stressPattern: dto.stressPattern?.trim() ?? '', etymology: dto.etymology?.trim() ?? '', usageNotes: dto.usageNotes?.trim() ?? '', wordForms: JSON.stringify(dto.wordForms ?? []), senses: JSON.stringify(dto.senses ?? []), synonyms: JSON.stringify(dto.synonyms?.map((value) => value.trim()).filter(Boolean) ?? []), antonyms: JSON.stringify(dto.antonyms?.map((value) => value.trim()).filter(Boolean) ?? []), collocations: JSON.stringify(dto.collocations?.map((value) => value.trim()).filter(Boolean) ?? []), grammarPatterns: JSON.stringify(dto.grammarPatterns ?? []), learningGoals: JSON.stringify(dto.learningGoals ?? []), context: dto.context?.trim() ?? '',
    } });
    return this.toEntity(word);
  }

  async update(id: number, dto: UpdateWordDto): Promise<Word | undefined> {
    try {
      const word = await this.prisma.word.update({ where: { id }, data: {
        ...(dto.english !== undefined && { english: dto.english.trim() }), ...(dto.meaning !== undefined && { meaning: dto.meaning.trim() }), ...(dto.example !== undefined && { example: dto.example.trim() }), ...(dto.category !== undefined && { category: dto.category.trim() }), ...(dto.source !== undefined && { source: dto.source.trim() }), ...(dto.notes !== undefined && { notes: dto.notes.trim() }), ...(dto.lemma !== undefined && { lemma: dto.lemma.trim() }), ...(dto.sourceLanguage !== undefined && { sourceLanguage: dto.sourceLanguage.trim() }), ...(dto.explanationLanguage !== undefined && { explanationLanguage: dto.explanationLanguage.trim() }), ...(dto.cefrLevel !== undefined && { cefrLevel: dto.cefrLevel.trim() }), ...(dto.partOfSpeech !== undefined && { partOfSpeech: dto.partOfSpeech.trim() }), ...(dto.register !== undefined && { register: dto.register.trim() }), ...(dto.frequency !== undefined && { frequency: dto.frequency.trim() }), ...(dto.tags !== undefined && { tags: JSON.stringify(dto.tags.map((tag) => tag.trim()).filter(Boolean)) }), ...(dto.pronunciation !== undefined && { pronunciation: dto.pronunciation.trim() }), ...(dto.pronunciationUS !== undefined && { pronunciationUS: dto.pronunciationUS.trim() }), ...(dto.pronunciationUK !== undefined && { pronunciationUK: dto.pronunciationUK.trim() }), ...(dto.syllables !== undefined && { syllables: dto.syllables.trim() }), ...(dto.stressPattern !== undefined && { stressPattern: dto.stressPattern.trim() }), ...(dto.etymology !== undefined && { etymology: dto.etymology.trim() }), ...(dto.usageNotes !== undefined && { usageNotes: dto.usageNotes.trim() }), ...(dto.wordForms !== undefined && { wordForms: JSON.stringify(dto.wordForms) }), ...(dto.senses !== undefined && { senses: JSON.stringify(dto.senses) }), ...(dto.synonyms !== undefined && { synonyms: JSON.stringify(dto.synonyms.map((value) => value.trim()).filter(Boolean)) }), ...(dto.antonyms !== undefined && { antonyms: JSON.stringify(dto.antonyms.map((value) => value.trim()).filter(Boolean)) }), ...(dto.collocations !== undefined && { collocations: JSON.stringify(dto.collocations.map((value) => value.trim()).filter(Boolean)) }), ...(dto.grammarPatterns !== undefined && { grammarPatterns: JSON.stringify(dto.grammarPatterns) }), ...(dto.learningGoals !== undefined && { learningGoals: JSON.stringify(dto.learningGoals) }), ...(dto.context !== undefined && { context: dto.context.trim() }),
      } });
      return this.toEntity(word);
    } catch { return undefined; }
  }

  async delete(id: number): Promise<boolean> {
    try { await this.prisma.word.delete({ where: { id } }); return true; } catch { return false; }
  }
}
