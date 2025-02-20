-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "address" TEXT,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "category" TEXT,
    "boardType" TEXT,
    "roomType" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "imageUrls" TEXT[],
    "pdfUrls" TEXT[],
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
