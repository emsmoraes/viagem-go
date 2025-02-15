/*
  Warnings:

  - Made the column `name` on table `customer_documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customer_documents" ALTER COLUMN "name" SET NOT NULL;
