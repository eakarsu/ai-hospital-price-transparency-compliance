"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function MrfValidation() {
  const [file, setFile] = useState<File | null>(null); const [version, setVersion] = useState("v3.0.0"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [result, setResult] = useState<{ valid: boolean; contentHash: string; scope: string; errors: { path: string; message: string }[]; alerts: { path: string; message: string }[] } | null>(null);
  async function run() {
    if (!file) return; setBusy(true); setError(""); setResult(null);
    try { const response = await fetch(`/api/mrf/validate?format=${file.name.toLowerCase().endsWith(".csv") ? "csv" : "json"}&version=${version}`, { method: "POST", body: file }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setResult(data); }
    catch (e) { setError(e instanceof Error ? e.message : "Validation failed"); } finally { setBusy(false); }
  }
  return <section className="space-y-3 rounded-xl border bg-white p-5"><h2 className="text-xl font-semibold">CMS machine-readable file validation</h2><p>Uploads are parsed by CMS’s validator, with errors and file hash saved. Maximum upload: 25 MB. For larger files use the CMS validator CLI locally.</p><input aria-label="MRF file" type="file" accept=".json,.csv" onChange={e => setFile(e.target.files?.[0] ?? null)}/><select aria-label="CMS schema version" value={version} onChange={e => setVersion(e.target.value)}>{["v3.0.0", "v2.2.0", "v2.1.0", "v2.0.0"].map(v => <option key={v}>{v}</option>)}</select><Button disabled={busy || !file || file.size > 25000000} onClick={run}>{busy ? "Validating file…" : "Validate uploaded file"}</Button>{error ? <p role="alert">{error}</p> : null}{result ? <div className="space-y-2"><p>{result.valid ? "Passed validator checks" : "Failed validator checks"}</p><p>{result.scope}</p><p className="break-all">SHA-256: {result.contentHash}</p><ul>{[...result.errors, ...result.alerts].map((item, i) => <li key={i}>{item.path}: {item.message}</li>)}</ul></div> : null}</section>;
}
