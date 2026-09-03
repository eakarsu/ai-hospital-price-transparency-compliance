// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const passwordHash = await bcrypt.hash("Demo!23456", 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-hospital-price-transparency-compliance.local", "Demo Admin", "ADMIN"],
    ["manager@ai-hospital-price-transparency-compliance.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-hospital-price-transparency-compliance.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Hospital = ["COMPLIANT", "AT_RISK", "NONCOMPLIANT"];
  await prisma.hospital.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.hospital.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      cmsNumber: `CmsNumber ${String(i + 1).padStart(3, "0")}`,
      system: `System ${String(i + 1).padStart(3, "0")}`,
      state: `State ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Hospital, i),
      bedCount: 5 + ((i * 13) % 95),
      fileUrl: `FileUrl ${String(i + 1).padStart(3, "0")}`
      },
    });
  }

  const hospitalRefs = await prisma.hospital.findMany({ select: { id: true } });

  const STATUSES_MachineReadableFile = ["DISCOVERED", "VALIDATING", "VALID", "INVALID"];
  await prisma.machineReadableFile.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.machineReadableFile.create({
      data: {
      fileName: `FileName ${String(i + 1).padStart(3, "0")}`,
      fileUrl: `FileUrl ${String(i + 1).padStart(3, "0")}`,
      format: `Format ${String(i + 1).padStart(3, "0")}`,
      sizeMb: `SizeMb ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_MachineReadableFile, i),
      publishedAt: daysAgo(i),
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_RateEntry = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.rateEntry.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.rateEntry.create({
      data: {
      code: `Code ${String(i + 1).padStart(3, "0")}`,
      codeType: `CodeType ${String(i + 1).padStart(3, "0")}`,
      description: `Description ${String(i + 1).padStart(3, "0")}`,
      payer: `Payer ${String(i + 1).padStart(3, "0")}`,
      negotiatedRate: amount(i, 250),
      setting: `Setting ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_NegotiatedRateTest = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.negotiatedRateTest.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.negotiatedRateTest.create({
      data: {
      testName: `TestName ${String(i + 1).padStart(3, "0")}`,
      payer: `Payer ${String(i + 1).padStart(3, "0")}`,
      expectedCount: 5 + ((i * 13) % 95),
      foundCount: 5 + ((i * 13) % 95),
      result: `Result ${String(i + 1).padStart(3, "0")}`,
      runAt: daysAgo(i),
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_PercentileCheck = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.percentileCheck.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.percentileCheck.create({
      data: {
      payer: `Payer ${String(i + 1).padStart(3, "0")}`,
      code: `Code ${String(i + 1).padStart(3, "0")}`,
      p10Amount: amount(i, 250),
      medianAmount: amount(i, 250),
      p90Amount: amount(i, 250),
      result: `Result ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_CodeNormalization = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.codeNormalization.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.codeNormalization.create({
      data: {
      rawCode: `RawCode ${String(i + 1).padStart(3, "0")}`,
      normalizedCode: `NormalizedCode ${String(i + 1).padStart(3, "0")}`,
      codeSystem: `CodeSystem ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CodeNormalization, i),
      issue: `Issue ${String(i + 1).padStart(3, "0")}`,
      processedAt: daysAgo(i),
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_AccessibilityCheck = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.accessibilityCheck.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.accessibilityCheck.create({
      data: {
      url: `Url ${String(i + 1).padStart(3, "0")}`,
      checkType: `CheckType ${String(i + 1).padStart(3, "0")}`,
      result: `Result ${String(i + 1).padStart(3, "0")}`,
      httpStatus: 5 + ((i * 13) % 95),
      checkedAt: daysAgo(i),
      blocker: `Blocker ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_Attestation = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.attestation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.attestation.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      executive: `Executive ${String(i + 1).padStart(3, "0")}`,
      statement: `Statement ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Attestation, i),
      signedAt: daysAgo(i),
      ipAddress: `IpAddress ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_CmsWarning = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.cmsWarning.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.cmsWarning.create({
      data: {
      reference: `Reference ${String(i + 1).padStart(3, "0")}`,
      violation: `Violation ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CmsWarning, i),
      receivedAt: daysAgo(i),
      deadline: daysAgo(i),
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_CorrectiveAction = ["PROPOSED", "ACTIVE", "COMPLETED", "CLOSED"];
  await prisma.correctiveAction.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.correctiveAction.create({
      data: {
      warningRef: `WarningRef ${String(i + 1).padStart(3, "0")}`,
      action: `Action ${String(i + 1).padStart(3, "0")}`,
      owner: `Owner ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CorrectiveAction, i),
      dueDate: daysAgo(i),
      evidenceRef: `EvidenceRef ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_BenchmarkReport = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.benchmarkReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.benchmarkReport.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      payer: `Payer ${String(i + 1).padStart(3, "0")}`,
      codeSet: `CodeSet ${String(i + 1).padStart(3, "0")}`,
      avgRate: amount(i, 250),
      peerDeltaPct: amount(i, 250),
      status: pick(STATUSES_BenchmarkReport, i),
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  const STATUSES_ValidationRun = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.validationRun.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.validationRun.create({
      data: {
      runType: `RunType ${String(i + 1).padStart(3, "0")}`,
      checksPassed: 5 + ((i * 13) % 95),
      checksFailed: 5 + ((i * 13) % 95),
      status: pick(STATUSES_ValidationRun, i),
      startedAt: daysAgo(i),
      triggeredBy: `TriggeredBy ${String(i + 1).padStart(3, "0")}`,
      hospital: { connect: { id: hospitalRefs[i % hospitalRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
