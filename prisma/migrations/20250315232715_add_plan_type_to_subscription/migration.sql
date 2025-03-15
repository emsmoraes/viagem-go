/*
  Warnings:

  - Added the required column `planType` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('INDIVIDUAL', 'AGENCY');

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "planType" "PlanType" NOT NULL;
