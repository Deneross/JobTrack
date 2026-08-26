-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('WAITING_RESPONSE', 'NEXT_INTERVIEW', 'REJECTED', 'OFFER');

-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'WAITING_RESPONSE';

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "outcome" "InterviewOutcome";
