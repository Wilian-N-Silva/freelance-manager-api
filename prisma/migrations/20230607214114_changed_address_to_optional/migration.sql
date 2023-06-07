-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "zipcode" TEXT,
    "street" TEXT,
    "number" TEXT,
    "district" TEXT
);
INSERT INTO "new_Address" ("district", "id", "number", "street", "zipcode") SELECT "district", "id", "number", "street", "zipcode" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
