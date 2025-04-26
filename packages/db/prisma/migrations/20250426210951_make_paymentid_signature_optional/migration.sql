-- DropIndex
DROP INDEX "payments_paymentId_key";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paymentId" DROP NOT NULL,
ALTER COLUMN "signature" DROP NOT NULL;
