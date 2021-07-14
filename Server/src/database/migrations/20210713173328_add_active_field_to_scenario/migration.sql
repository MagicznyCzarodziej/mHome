/*
  Warnings:

  - Added the required column `active` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scenario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "entries" TEXT NOT NULL
);
INSERT INTO "new_Scenario" ("id", "name", "description", "entries") SELECT "id", "name", "description", "entries" FROM "Scenario";
DROP TABLE "Scenario";
ALTER TABLE "new_Scenario" RENAME TO "Scenario";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
