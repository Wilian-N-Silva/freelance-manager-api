/*
  Warnings:

  - The primary key for the `PaymentPeriod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isAvailable` on the `PaymentPeriod` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `PaymentPeriod` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `paymentPeriodId` on the `ProposalPaymentPeriod` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentPeriod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_PaymentPeriod" ("id", "name") SELECT "id", "name" FROM "PaymentPeriod";
DROP TABLE "PaymentPeriod";
ALTER TABLE "new_PaymentPeriod" RENAME TO "PaymentPeriod";
CREATE UNIQUE INDEX "PaymentPeriod_name_key" ON "PaymentPeriod"("name");
CREATE TABLE "new_ProposalPaymentPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "paymentPeriodId" INTEGER NOT NULL,
    "paymentPeriodFrequency" INTEGER NOT NULL,
    CONSTRAINT "ProposalPaymentPeriod_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProposalPaymentPeriod_paymentPeriodId_fkey" FOREIGN KEY ("paymentPeriodId") REFERENCES "PaymentPeriod" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProposalPaymentPeriod" ("id", "paymentPeriodFrequency", "paymentPeriodId", "proposalId") SELECT "id", "paymentPeriodFrequency", "paymentPeriodId", "proposalId" FROM "ProposalPaymentPeriod";
DROP TABLE "ProposalPaymentPeriod";
ALTER TABLE "new_ProposalPaymentPeriod" RENAME TO "ProposalPaymentPeriod";
CREATE UNIQUE INDEX "ProposalPaymentPeriod_id_key" ON "ProposalPaymentPeriod"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
