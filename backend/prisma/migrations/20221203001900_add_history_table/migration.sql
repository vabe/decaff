-- CreateTable
CREATE TABLE "History" (
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "History_userId_listingId_key" ON "History"("userId", "listingId");
