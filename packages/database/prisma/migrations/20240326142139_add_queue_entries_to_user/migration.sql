-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QueueEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "actionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "QueueEntry_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QueueEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QueueEntry" ("actionId", "createdAt", "id", "order", "updatedAt") SELECT "actionId", "createdAt", "id", "order", "updatedAt" FROM "QueueEntry";
DROP TABLE "QueueEntry";
ALTER TABLE "new_QueueEntry" RENAME TO "QueueEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
