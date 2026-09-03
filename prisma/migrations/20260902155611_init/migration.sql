-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'ANALYST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cmsNumber" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "bedCount" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineReadableFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "sizeMb" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineReadableFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateEntry" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "negotiatedRate" DOUBLE PRECISION NOT NULL,
    "setting" TEXT NOT NULL,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NegotiatedRateTest" (
    "id" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "expectedCount" INTEGER NOT NULL,
    "foundCount" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "runAt" TIMESTAMP(3),
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NegotiatedRateTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PercentileCheck" (
    "id" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "p10Amount" DOUBLE PRECISION NOT NULL,
    "medianAmount" DOUBLE PRECISION NOT NULL,
    "p90Amount" DOUBLE PRECISION NOT NULL,
    "result" TEXT NOT NULL,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PercentileCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeNormalization" (
    "id" TEXT NOT NULL,
    "rawCode" TEXT NOT NULL,
    "normalizedCode" TEXT NOT NULL,
    "codeSystem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issue" TEXT,
    "processedAt" TIMESTAMP(3),
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeNormalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessibilityCheck" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "httpStatus" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "blocker" TEXT,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessibilityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "executive" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsWarning" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "violation" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsWarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveAction" (
    "id" TEXT NOT NULL,
    "warningRef" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "evidenceRef" TEXT,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectiveAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkReport" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "codeSet" TEXT NOT NULL,
    "avgRate" DOUBLE PRECISION NOT NULL,
    "peerDeltaPct" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BenchmarkReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationRun" (
    "id" TEXT NOT NULL,
    "runType" TEXT NOT NULL,
    "checksPassed" INTEGER NOT NULL,
    "checksFailed" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "triggeredBy" TEXT NOT NULL,
    "hospitalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MachineReadableFile" ADD CONSTRAINT "MachineReadableFile_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateEntry" ADD CONSTRAINT "RateEntry_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegotiatedRateTest" ADD CONSTRAINT "NegotiatedRateTest_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PercentileCheck" ADD CONSTRAINT "PercentileCheck_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeNormalization" ADD CONSTRAINT "CodeNormalization_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessibilityCheck" ADD CONSTRAINT "AccessibilityCheck_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsWarning" ADD CONSTRAINT "CmsWarning_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectiveAction" ADD CONSTRAINT "CorrectiveAction_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkReport" ADD CONSTRAINT "BenchmarkReport_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationRun" ADD CONSTRAINT "ValidationRun_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
