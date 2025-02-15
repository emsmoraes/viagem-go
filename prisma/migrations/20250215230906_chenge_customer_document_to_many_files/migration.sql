/*
  Warnings:

  - You are about to drop the column `type` on the `customer_documents` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `customer_documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer_documents" DROP COLUMN "type",
DROP COLUMN "url",
ADD COLUMN     "fileUrls" TEXT[];
