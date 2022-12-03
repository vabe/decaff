/*
  Warnings:

  - The `preview` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `caption` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceCreatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "caption" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "sourceCreatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "preview",
ADD COLUMN     "preview" INTEGER[];
