-- CreateTable
CREATE TABLE "ProposalDestination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverUrl" TEXT,
    "description" TEXT,
    "departureDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalDestination_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalDestination" ADD CONSTRAINT "ProposalDestination_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
