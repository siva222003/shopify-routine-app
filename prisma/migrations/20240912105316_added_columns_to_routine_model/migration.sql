/*
  Warnings:

  - You are about to drop the column `email` on the `Routine` table. All the data in the column will be lost.
  - Added the required column `category` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT (abs(random()) % 1000000),
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft'
);
INSERT INTO "new_Routine" ("id") SELECT "id" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
