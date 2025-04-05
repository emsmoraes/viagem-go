/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `cruises` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrls` on the `cruises` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cruises" DROP COLUMN "imageUrls",
DROP COLUMN "pdfUrls",
ADD COLUMN     "files" TEXT[],
ADD COLUMN     "images" TEXT[];
