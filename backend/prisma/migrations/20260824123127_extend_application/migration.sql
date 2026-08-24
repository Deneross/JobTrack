/*
  Warnings:

  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('APPRENTICESHIP', 'INTERNSHIP', 'CDD', 'CDI', 'FREELANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "contractType" "ContractType",
ADD COLUMN     "followUpAt" TIMESTAMP(3),
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
