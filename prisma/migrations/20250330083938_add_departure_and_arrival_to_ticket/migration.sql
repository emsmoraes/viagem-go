/*
  Warnings:

  - Added the required column `arrivalAt` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureAt` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "arrivalAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "departureAt" TIMESTAMP(3) NOT NULL;
