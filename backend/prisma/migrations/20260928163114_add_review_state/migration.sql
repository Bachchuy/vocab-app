-- CreateTable
CREATE TABLE "ReviewState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "dueAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" DATETIME,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewState_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "rating" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseMs" INTEGER,
    CONSTRAINT "ReviewHistory_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewState_wordId_key" ON "ReviewState"("wordId");

-- CreateIndex
CREATE INDEX "ReviewState_dueAt_idx" ON "ReviewState"("dueAt");

-- CreateIndex
CREATE INDEX "ReviewState_status_idx" ON "ReviewState"("status");

-- CreateIndex
CREATE INDEX "ReviewHistory_wordId_reviewedAt_idx" ON "ReviewHistory"("wordId", "reviewedAt");
