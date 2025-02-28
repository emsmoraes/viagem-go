/*
  Warnings:

  - You are about to drop the column `userId` on the `agencies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "agencies" DROP CONSTRAINT "agencies_userId_fkey";

-- DropIndex
DROP INDEX "agencies_userId_key";

-- AlterTable
ALTER TABLE "agencies" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "agencyId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
