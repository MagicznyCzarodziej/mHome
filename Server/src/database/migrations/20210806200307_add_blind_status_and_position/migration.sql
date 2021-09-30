/*
  Warnings:

  - You are about to drop the column `state` on the `Blinds` table. All the data in the column will be lost.
  - Added the required column `position` to the `Blinds` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blinds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IDLE',
    "groupId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Blinds" ("id", "name", "description", "groupId", "updatedAt") SELECT "id", "name", "description", "groupId", "updatedAt" FROM "Blinds";
DROP TABLE "Blinds";
ALTER TABLE "new_Blinds" RENAME TO "Blinds";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
