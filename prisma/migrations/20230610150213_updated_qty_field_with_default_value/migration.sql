-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectServices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ProjectServices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectServices" ("id", "projectId", "qty", "serviceId", "value") SELECT "id", "projectId", "qty", "serviceId", "value" FROM "ProjectServices";
DROP TABLE "ProjectServices";
ALTER TABLE "new_ProjectServices" RENAME TO "ProjectServices";
CREATE UNIQUE INDEX "ProjectServices_id_key" ON "ProjectServices"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
