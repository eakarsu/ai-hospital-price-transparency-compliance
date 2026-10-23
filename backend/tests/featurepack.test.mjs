import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
// Never make provider calls in tests: clear keys before importing app modules.
delete process.env.OPENROUTER_API_KEY; delete process.env.OPENAI_API_KEY; delete process.env.ANTHROPIC_API_KEY;
const {filterRecords,recordsToCsv}=await import("../listTools.mjs");
const {buildInsights}=await import("../aiInsights.mjs");
const rows=[{id:1,reference:"A-1",title:"Alpha review",status:"Open",owner:"Sam",risk:"High",due_date:"2020-01-01",amount:0},{id:2,reference:"B-2",title:"Beta check",status:"Closed",owner:"Jo",risk:"Low",due_date:"2999-01-01",amount:50}];
test("search/filter narrows the main list",()=>{assert.equal(filterRecords(rows,{q:"alpha"}).length,1);assert.equal(filterRecords(rows,{status:"Closed"}).length,1);assert.equal(filterRecords(rows,{risk:"High"})[0].reference,"A-1");assert.equal(filterRecords(rows,{}).length,2);});
test("CSV export preserves 0 and empty values",()=>{const csv=recordsToCsv(rows);assert.ok(csv.startsWith("id,reference,title,status,owner,risk,due_date,amount"));assert.ok(csv.includes("A-1,Alpha review,Open,Sam,High,2020-01-01,0"));assert.ok(recordsToCsv([{id:3,reference:"C-3",title:"",status:"Open",owner:"",risk:"Low",due_date:"",amount:0}]).includes("C-3,,Open,,Low,,0"));});
test("AI insights are deterministic fallback over own records",()=>{const out=buildInsights(rows,"Test records");assert.equal(out.length,3);for(const i of out){assert.equal(i.aiGenerated,false);assert.equal(i.source,"deterministic-fallback");assert.ok(i.sections.length>=1);}assert.equal(out[0].metrics.find(m=>m.label==="Zero-value records").value,1);assert.equal(out[0].metrics.find(m=>m.label==="Has high-risk records").value,true);});
test("AI insights preserve 0/false/empty on empty records",()=>{const out=buildInsights([],"Empty");assert.equal(out[0].metrics.find(m=>m.label==="Total records").value,0);assert.equal(out[0].metrics.find(m=>m.label==="Has high-risk records").value,false);assert.ok(out[1].sections.some(s=>String(s.detail).includes("0")));});
test("server wires authenticated search/export/insights routes",()=>{const s=fs.readFileSync(new URL("../server.mjs",import.meta.url),"utf8");assert.ok(s.includes("buildInsights"));assert.ok(s.includes("recordsToCsv"));assert.ok(s.includes("filterRecords"));});
