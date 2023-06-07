/*
  Warnings:

  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj` on the `Company` table. All the data in the column will be lost.
  - Added the required column `taxPayerRegistry` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "taxPayerRegistry" TEXT,
    "registrationNumber" TEXT,
    "companyName" TEXT,
    "tradingName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "addressId" TEXT,
    CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taxPayerRegistry" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "representativeId" TEXT NOT NULL,
    "addressId" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tradingName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    CONSTRAINT "Company_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("addressId", "companyName", "email", "id", "phone", "representativeId", "tradingName") SELECT "addressId", "companyName", "email", "id", "phone", "representativeId", "tradingName" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
