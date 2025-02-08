/*
  Warnings:

  - Added the required column `type` to the `user_keys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_keys" ADD COLUMN     "type" TEXT NOT NULL;
