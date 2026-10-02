import { WordProps } from './vocabulary.types';

// Aggregate root for one vocabulary entry. Persistence details stay in the repository.
export class Word {
  private readonly props: WordProps;

  constructor(props: WordProps) {
    this.props = {
      ...props,
      term: props.term.trim(),
      lemma: props.lemma.trim() || props.term.trim(),
      tags: [...props.tags],
      wordForms: [...props.wordForms],
      senses: [...props.senses],
      synonyms: [...props.synonyms],
      antonyms: [...props.antonyms],
      collocations: [...props.collocations],
      grammarPatterns: [...props.grammarPatterns],
      learningGoals: [...props.learningGoals],
    };
  }

  get id(): number { return this.props.id; }
  get term(): string { return this.props.term; }
  get english(): string { return this.props.term; }
  get meaning(): string { return this.props.meaning; }
  get example(): string { return this.props.example; }
  get category(): string { return this.props.category; }
  get source(): string { return this.props.source; }
  get notes(): string { return this.props.notes; }
  get lemma(): string { return this.props.lemma; }
  get sourceLanguage(): string { return this.props.sourceLanguage; }
  get explanationLanguage(): string { return this.props.explanationLanguage; }
  get cefrLevel(): WordProps['cefrLevel'] { return this.props.cefrLevel; }
  get partOfSpeech(): string { return this.props.partOfSpeech; }
  get register(): string { return this.props.register; }
  get frequency(): string { return this.props.frequency; }
  get pronunciation(): string { return this.props.pronunciation; }
  get pronunciationUS(): string { return this.props.pronunciationUS; }
  get pronunciationUK(): string { return this.props.pronunciationUK; }
  get syllables(): string { return this.props.syllables; }
  get stressPattern(): string { return this.props.stressPattern; }
  get etymology(): string { return this.props.etymology; }
  get usageNotes(): string { return this.props.usageNotes; }
  get tags(): string[] { return [...this.props.tags]; }
  get dateAdded(): string { return this.props.dateAdded; }
  get wordForms() { return [...this.props.wordForms]; }
  get senses() { return [...this.props.senses]; }
  get synonyms(): string[] { return [...this.props.synonyms]; }
  get antonyms(): string[] { return [...this.props.antonyms]; }
  get collocations(): string[] { return [...this.props.collocations]; }
  get grammarPatterns(): string[] { return [...this.props.grammarPatterns]; }
  get learningGoals() { return [...this.props.learningGoals]; }
  get context(): string { return this.props.context; }

  toJSON(): WordProps & { english: string } {
    return { ...this.props, english: this.term };
  }

  hasLearningGoal(name: string): boolean {
    return this.props.learningGoals.some((goal) => goal.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase());
  }
}
