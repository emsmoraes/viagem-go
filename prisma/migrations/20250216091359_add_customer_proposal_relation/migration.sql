-- CreateTable
CREATE TABLE "_ProposalToCustomers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProposalToCustomers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProposalToCustomers_B_index" ON "_ProposalToCustomers"("B");

-- AddForeignKey
ALTER TABLE "_ProposalToCustomers" ADD CONSTRAINT "_ProposalToCustomers_A_fkey" FOREIGN KEY ("A") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposalToCustomers" ADD CONSTRAINT "_ProposalToCustomers_B_fkey" FOREIGN KEY ("B") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
