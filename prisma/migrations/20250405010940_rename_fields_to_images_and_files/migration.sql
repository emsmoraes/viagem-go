/*
  Warnings:

  - You are about to drop the column `pdfs` on the `accommodations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accommodations" DROP COLUMN "pdfs",
ADD COLUMN     "files" TEXT[];
