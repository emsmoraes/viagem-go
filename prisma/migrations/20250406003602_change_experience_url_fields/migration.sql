/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrls` on the `experiences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "imageUrls",
DROP COLUMN "pdfUrls",
ADD COLUMN     "files" TEXT[],
ADD COLUMN     "images" TEXT[];
