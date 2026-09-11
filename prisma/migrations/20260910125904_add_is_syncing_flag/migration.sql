-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopDomain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "googleAccountId" TEXT,
    "sheetId" TEXT,
    "sheetUrl" TEXT,
    "lastSyncedAt" DATETIME,
    "isSyncing" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Shop_googleAccountId_fkey" FOREIGN KEY ("googleAccountId") REFERENCES "GoogleAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shop" ("createdAt", "googleAccountId", "id", "lastSyncedAt", "sheetId", "sheetUrl", "shopDomain", "updatedAt") SELECT "createdAt", "googleAccountId", "id", "lastSyncedAt", "sheetId", "sheetUrl", "shopDomain", "updatedAt" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_shopDomain_key" ON "Shop"("shopDomain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
