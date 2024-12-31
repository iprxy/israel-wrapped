/*
  Warnings:

  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `B` on the `_AlertToCity` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `id` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "he" TEXT NOT NULL,
    "ru" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    "countdown" INTEGER NOT NULL,
    CONSTRAINT "City_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_City" ("areaId", "countdown", "en", "he", "ru") SELECT "areaId", "countdown", "en", "he", "ru" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE UNIQUE INDEX "City_he_key" ON "City"("he");
CREATE TABLE "new__AlertToCity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlertToCity_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlertToCity_B_fkey" FOREIGN KEY ("B") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__AlertToCity" ("A", "B") SELECT "A", "B" FROM "_AlertToCity";
DROP TABLE "_AlertToCity";
ALTER TABLE "new__AlertToCity" RENAME TO "_AlertToCity";
CREATE UNIQUE INDEX "_AlertToCity_AB_unique" ON "_AlertToCity"("A", "B");
CREATE INDEX "_AlertToCity_B_index" ON "_AlertToCity"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
