/*
  Warnings:

  - The primary key for the `PaymentPeriod` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_PaymentPeriod" ("id", "name") SELECT "id", "name" FROM "PaymentPeriod";
DROP TABLE "PaymentPeriod";
ALTER TABLE "new_PaymentPeriod" RENAME TO "PaymentPeriod";
CREATE UNIQUE INDEX "PaymentPeriod_name_key" ON "PaymentPeriod"("name");
CREATE TABLE "new_ProposalPaymentPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "paymentPeriodId" TEXT NOT NULL,
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
