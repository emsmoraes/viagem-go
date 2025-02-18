-- CreateTable
CREATE TABLE "segments" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departure" TIMESTAMP(3),
    "arrival" TIMESTAMP(3),
    "flightNumber" TEXT,
    "airline" TEXT,
    "class" TEXT,
    "duration" TEXT,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
