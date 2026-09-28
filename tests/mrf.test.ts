import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateMrf } from "../src/lib/mrf-validator";
test("official CMS validator accepts a valid fixture and rejects invalid file contents", async () => {
  const bytes = readFileSync("node_modules/@cmsgov/hpt-validator/test/fixtures/sample-valid.json");
  assert.equal((await validateMrf(bytes, "json", "v2.0.0")).valid, true);
  assert.equal((await validateMrf(new TextEncoder().encode('{}'), "json", "v3.0.0")).valid, false);
  await assert.rejects(validateMrf(bytes, "json", "v99"), /Unsupported/);
});
