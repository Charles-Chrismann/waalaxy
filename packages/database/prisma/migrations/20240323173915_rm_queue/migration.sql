/*
  Warnings:

  - You are about to drop the `Queue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `queueId` on the `QueueEntry` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Queue";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QueueEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "actionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "QueueEntry_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QueueEntry" ("actionId", "createdAt", "id", "order", "updatedAt") SELECT "actionId", "createdAt", "id", "order", "updatedAt" FROM "QueueEntry";
DROP TABLE "QueueEntry";
ALTER TABLE "new_QueueEntry" RENAME TO "QueueEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
