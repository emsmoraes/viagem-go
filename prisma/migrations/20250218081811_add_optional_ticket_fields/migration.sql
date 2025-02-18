-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "baggagePerPerson" INTEGER,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "price" DECIMAL(10,2);
