/*
  Warnings:

  - The values [AGENCY,COMMON] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('AGENCY_ADMIN', 'AGENCY_EMPLOYEE');
ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'AGENCY_ADMIN';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'AGENCY_ADMIN';
