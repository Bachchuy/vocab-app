const { PrismaClient } = require('@prisma/client');
const fs = require('node:fs');
const path = require('node:path');

const prisma = new PrismaClient();
const sourcePath = path.join(__dirname, '..', 'data', 'words.json');

async function main() {
  const words = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  for (const word of words) {
    await prisma.word.upsert({
      where: { id: word.id },
      update: {},
      create: {
        id: word.id,
        english: word.english,
        meaning: word.meaning,
        example: word.example ?? '',
        category: word.category ?? 'general',
        source: word.source ?? '',
        notes: word.notes ?? '',
        lemma: word.lemma ?? word.english,
        sourceLanguage: word.sourceLanguage ?? 'en',
        explanationLanguage: word.explanationLanguage ?? 'vi',
        partOfSpeech: word.partOfSpeech ?? '',
        tags: JSON.stringify(word.tags ?? []),
        dateAdded: word.dateAdded ? new Date(word.dateAdded) : new Date(),
      },
    });
  }
  console.log(`Seeded ${words.length} existing words.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
