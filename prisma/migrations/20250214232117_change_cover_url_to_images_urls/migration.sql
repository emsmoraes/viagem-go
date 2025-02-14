/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `ProposalDestination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProposalDestination" DROP COLUMN "coverUrl",
ADD COLUMN     "images" TEXT[];
