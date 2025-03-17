-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "stripeSessionId" DROP NOT NULL,
ALTER COLUMN "paymentStatus" DROP NOT NULL;
