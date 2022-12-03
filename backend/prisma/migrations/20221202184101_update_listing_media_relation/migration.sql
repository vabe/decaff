/*
  Warnings:

  - You are about to drop the column `listingId` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_listingId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "mediaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "listingId";

-- CreateIndex
CREATE UNIQUE INDEX "Listing_mediaId_key" ON "Listing"("mediaId");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
