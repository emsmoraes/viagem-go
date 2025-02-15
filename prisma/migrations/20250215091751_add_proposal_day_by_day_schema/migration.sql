/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ProposalDestination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProposalDestination" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "ProposalDayByDay" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "images" TEXT[],
    "description" TEXT,
    "departureDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalDayByDay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalDayByDay" ADD CONSTRAINT "ProposalDayByDay_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
