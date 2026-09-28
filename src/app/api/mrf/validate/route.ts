import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { authorize } from "@/lib/api-auth";
import { readBounded } from "@/lib/request-body";
import { validateMrf } from "@/lib/mrf-validator";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonValue } from "@/lib/record-store";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const user = await authorize("write");
    const bytes = await readBounded(request, 25000000);
    const format = request.nextUrl.searchParams.get("format") || "json";
    const version = request.nextUrl.searchParams.get("version") || "v3.0.0";
    const result = await validateMrf(bytes, format, version);
    const hash = createHash("sha256").update(bytes).digest("hex");
    const saved = await prisma.$transaction(async tx => {
      const analysis = await tx.workflowAnalysis.create({ data: { actorId: user.id, workflow: "cms-mrf-validate", subjectEntity: "UploadedMRF", subjectId: hash, input: { format, version, bytes: bytes.length }, evidence: { contentHash: hash }, evidenceHash: hash, result: jsonValue(result), model: result.validator } });
      await tx.auditLog.create({ data: { actorId: user.id, actorName: user.name, action: "CMS_MRF_VALIDATED", entity: "WorkflowAnalysis", entityId: analysis.id, detail: JSON.stringify({ hash, version, valid: result.valid, errors: result.errors.length }) } });
      return analysis;
    });
    return Response.json({ id: saved.id, contentHash: hash, ...result });
  } catch (error) { return errorResponse(error); }
}
