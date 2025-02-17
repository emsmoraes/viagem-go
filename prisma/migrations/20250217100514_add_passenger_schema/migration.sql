/*
  Warnings:

  - You are about to drop the `_ProposalToCustomers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProposalToCustomers" DROP CONSTRAINT "_ProposalToCustomers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProposalToCustomers" DROP CONSTRAINT "_ProposalToCustomers_B_fkey";

-- DropTable
DROP TABLE "_ProposalToCustomers";

-- CreateTable
CREATE TABLE "passengers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "customerId" TEXT,
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
