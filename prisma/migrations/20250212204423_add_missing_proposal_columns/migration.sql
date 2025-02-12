-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('INCOMPLETE', 'AWAITING_RESPONSE', 'CONFIRMED', 'LOST');

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "departureDate" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "returnDate" TIMESTAMP(3),
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'INCOMPLETE';
