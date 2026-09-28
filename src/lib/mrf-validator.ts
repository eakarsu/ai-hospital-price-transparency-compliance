import { Readable } from "node:stream";
import { JsonValidator, CsvValidator } from "@cmsgov/hpt-validator";
import { RequestError } from "./record-policy";
export async function validateMrf(bytes: Uint8Array, format: string, version: string) {
  if (!["v2.0.0", "v2.1.0", "v2.2.0", "v3.0.0"].includes(version)) throw new RequestError("Unsupported CMS schema version");
  if (!["json", "csv"].includes(format)) throw new RequestError("Upload a JSON or CSV MRF");
  const validator = format === "json" ? new JsonValidator(version) : new CsvValidator(version, { maxErrors: 1000 });
  const result = await validator.validate(Readable.from([Buffer.from(bytes)]), { maxErrors: 1000 });
  return { valid: result.valid, errors: result.errors, alerts: result.alerts, validator: "@cmsgov/hpt-validator@2.6.0", schemaVersion: version, scope: "CMS file structure and implemented data checks; not certification of published price accuracy or full regulatory compliance" };
}
