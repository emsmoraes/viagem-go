-- CreateTable
CREATE TABLE "cruises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cabin" TEXT,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "route" TEXT,
    "description" TEXT,
    "paymentMethods" TEXT,
    "imageUrls" TEXT[],
    "pdfUrls" TEXT[],
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cruises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cruises" ADD CONSTRAINT "cruises_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
