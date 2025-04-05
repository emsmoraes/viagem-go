/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `accommodations` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrls` on the `accommodations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accommodations" DROP COLUMN "imageUrls",
DROP COLUMN "pdfUrls",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "pdfs" TEXT[];
