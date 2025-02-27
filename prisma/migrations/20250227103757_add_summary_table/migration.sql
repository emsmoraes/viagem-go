-- CreateTable
CREATE TABLE "summaries" (
    "id" TEXT NOT NULL,
    "includedInProposal" TEXT NOT NULL,
    "totalValue" DECIMAL(10,2),
    "conditionsAndValidity" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "summaries_proposalId_key" ON "summaries"("proposalId");

-- AddForeignKey
ALTER TABLE "summaries" ADD CONSTRAINT "summaries_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
