-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT (abs(random()) % 1000000),
    "email" TEXT NOT NULL
);
INSERT INTO "new_Routine" ("email", "id") SELECT "email", "id" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
