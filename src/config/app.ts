export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-hospital-price-transparency-compliance",
  title: "ClearRate Hospital Transparency",
  tagline: "CMS hospital price transparency compliance",
  accent: "sky",
};

export const pages: PageConfig[] = [
  {
    label: "Hospitals & Files",
    href: "/hospitals",
    description: "Hospital inventory and machine-readable files.",
    entities: ["Hospital", "MachineReadableFile", "ValidationRun"],
    workflows: ["file-validate"],
  },
  {
    label: "Rate Integrity",
    href: "/rates",
    description: "Negotiated rates, code normalization, percentile checks.",
    entities: ["RateEntry", "NegotiatedRateTest", "PercentileCheck", "CodeNormalization"],
    workflows: ["rate-compare"],
  },
  {
    label: "Compliance",
    href: "/compliance",
    description: "Accessibility, attestations, CMS warnings, corrective actions.",
    entities: ["AccessibilityCheck", "Attestation", "CmsWarning", "CorrectiveAction"],
    workflows: ["attestation-draft"],
  },
  {
    label: "Benchmarks",
    href: "/benchmarks",
    description: "Cross-hospital contract-rate benchmarking.",
    entities: ["BenchmarkReport"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Hospital: {
    name: "Hospital",
    label: "Hospital",
    fields: [{ name: "name", kind: "string" }, { name: "cmsNumber", kind: "string" }, { name: "system", kind: "string" }, { name: "state", kind: "string" }, { name: "status", kind: "string" }, { name: "bedCount", kind: "number" }, { name: "fileUrl", kind: "string" }],
  },
  MachineReadableFile: {
    name: "MachineReadableFile",
    label: "MRF File",
    fields: [{ name: "fileName", kind: "string" }, { name: "fileUrl", kind: "string" }, { name: "format", kind: "string" }, { name: "sizeMb", kind: "string" }, { name: "status", kind: "string" }, { name: "publishedAt", kind: "date" }],
  },
  RateEntry: {
    name: "RateEntry",
    label: "Rate Entry",
    fields: [{ name: "code", kind: "string" }, { name: "codeType", kind: "string" }, { name: "description", kind: "string" }, { name: "payer", kind: "string" }, { name: "negotiatedRate", kind: "number" }, { name: "setting", kind: "string" }],
  },
  NegotiatedRateTest: {
    name: "NegotiatedRateTest",
    label: "Completeness Test",
    fields: [{ name: "testName", kind: "string" }, { name: "payer", kind: "string" }, { name: "expectedCount", kind: "number" }, { name: "foundCount", kind: "number" }, { name: "result", kind: "string" }, { name: "runAt", kind: "date" }],
  },
  PercentileCheck: {
    name: "PercentileCheck",
    label: "Percentile Check",
    fields: [{ name: "payer", kind: "string" }, { name: "code", kind: "string" }, { name: "p10Amount", kind: "number" }, { name: "medianAmount", kind: "number" }, { name: "p90Amount", kind: "number" }, { name: "result", kind: "string" }],
  },
  CodeNormalization: {
    name: "CodeNormalization",
    label: "Code Normalization",
    fields: [{ name: "rawCode", kind: "string" }, { name: "normalizedCode", kind: "string" }, { name: "codeSystem", kind: "string" }, { name: "status", kind: "string" }, { name: "issue", kind: "string" }, { name: "processedAt", kind: "date" }],
  },
  AccessibilityCheck: {
    name: "AccessibilityCheck",
    label: "Accessibility Check",
    fields: [{ name: "url", kind: "string" }, { name: "checkType", kind: "string" }, { name: "result", kind: "string" }, { name: "httpStatus", kind: "number" }, { name: "checkedAt", kind: "date" }, { name: "blocker", kind: "string" }],
  },
  Attestation: {
    name: "Attestation",
    label: "Attestation",
    fields: [{ name: "period", kind: "string" }, { name: "executive", kind: "string" }, { name: "statement", kind: "string" }, { name: "status", kind: "string" }, { name: "signedAt", kind: "date" }, { name: "ipAddress", kind: "string" }],
  },
  CmsWarning: {
    name: "CmsWarning",
    label: "CMS Warning",
    fields: [{ name: "reference", kind: "string" }, { name: "violation", kind: "string" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "receivedAt", kind: "date" }, { name: "deadline", kind: "date" }],
  },
  CorrectiveAction: {
    name: "CorrectiveAction",
    label: "Corrective Action",
    fields: [{ name: "warningRef", kind: "string" }, { name: "action", kind: "string" }, { name: "owner", kind: "string" }, { name: "status", kind: "string" }, { name: "dueDate", kind: "date" }, { name: "evidenceRef", kind: "string" }],
  },
  BenchmarkReport: {
    name: "BenchmarkReport",
    label: "Benchmark Report",
    fields: [{ name: "period", kind: "string" }, { name: "payer", kind: "string" }, { name: "codeSet", kind: "string" }, { name: "avgRate", kind: "number" }, { name: "peerDeltaPct", kind: "number" }, { name: "status", kind: "string" }],
  },
  ValidationRun: {
    name: "ValidationRun",
    label: "Validation Run",
    fields: [{ name: "runType", kind: "string" }, { name: "checksPassed", kind: "number" }, { name: "checksFailed", kind: "number" }, { name: "status", kind: "string" }, { name: "startedAt", kind: "date" }, { name: "triggeredBy", kind: "string" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "file-validate",
    title: "Draft: MRF Validator",
    description: "Validate a machine-readable file against CMS schema.",
    prompt: "Explain an attached CMS validator result and its source file hash. A URL or description alone is not file validation. Direct users to the CMS file validator under Domain tools if no validator result is supplied.",
    fields: ["fileUrl", "format", "sizeMb", "validatorResult", "knownIssues"],
  },
  {
    slug: "rate-compare",
    title: "Draft: Rate Benchmark Analyst",
    description: "Compare negotiated rates across peer hospitals.",
    prompt: "You are a managed-care analyst. Compare the hospital's negotiated rate for the code to peer benchmarks and flag outlier variances with likely causes.",
    fields: ["code", "rate", "peerRates", "payer"],
  },
  {
    slug: "attestation-draft",
    title: "Draft: Attestation Drafter",
    description: "Draft the executive accuracy attestation.",
    prompt: "You are a compliance officer. Draft a hospital price transparency executive attestation reflecting validation results, deficiencies, and remediation.",
    fields: ["period", "executive", "validationSummary", "deficiencies"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
