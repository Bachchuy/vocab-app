export const wordSuggestionSchema: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    meaning: { type: 'string', maxLength: 200 },
    example: { type: 'string', maxLength: 500 },
    partOfSpeech: { type: 'string', maxLength: 50 },
    pronunciation: { type: 'string', maxLength: 80 },
    wordForms: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          partOfSpeech: { type: 'string', maxLength: 30 },
          form: { type: 'string', maxLength: 100 },
          meaning: { type: 'string', maxLength: 200 },
        },
        required: ['partOfSpeech', 'form', 'meaning'],
      },
    },
    synonyms: { type: 'array', items: { type: 'string', maxLength: 100 } },
    antonyms: { type: 'array', items: { type: 'string', maxLength: 100 } },
    collocations: { type: 'array', items: { type: 'string', maxLength: 200 } },
    toeicContext: { type: 'string', maxLength: 200 },
  },
  required: [
    'meaning',
    'example',
    'partOfSpeech',
    'pronunciation',
    'wordForms',
    'synonyms',
    'antonyms',
    'collocations',
    'toeicContext',
  ],
};
