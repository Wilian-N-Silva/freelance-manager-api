-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isCompany" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_Client" ("addressId", "companyName", "email", "id", "name", "phone", "registrationNumber", "taxPayerRegistry", "tradingName") SELECT "addressId", "companyName", "email", "id", "name", "phone", "registrationNumber", "taxPayerRegistry", "tradingName" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
