/*
  Warnings:

  - You are about to drop the column `pdfUrls` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "pdfUrls",
ADD COLUMN     "fileUrls" TEXT[];
