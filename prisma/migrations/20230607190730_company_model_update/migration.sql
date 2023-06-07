/*
  Warnings:

  - Added the required column `representativeId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "representativeId" TEXT NOT NULL,
    "addressId" TEXT,
    "cnpj" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tradingName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    CONSTRAINT "Company_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("addressId", "cnpj", "companyName", "email", "id", "phone", "tradingName") SELECT "addressId", "cnpj", "companyName", "email", "id", "phone", "tradingName" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
