/*
  Warnings:

  - Made the column `userId` on table `QueueEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QueueEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "actionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "QueueEntry_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QueueEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QueueEntry" ("actionId", "createdAt", "id", "order", "updatedAt", "userId") SELECT "actionId", "createdAt", "id", "order", "updatedAt", "userId" FROM "QueueEntry";
DROP TABLE "QueueEntry";
ALTER TABLE "new_QueueEntry" RENAME TO "QueueEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
