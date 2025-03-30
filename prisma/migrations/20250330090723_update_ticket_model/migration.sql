/*
  Warnings:

  - You are about to drop the column `name` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `destination` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "name",
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "origin" TEXT NOT NULL;
