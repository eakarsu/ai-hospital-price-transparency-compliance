// Domain AI features over the app's own records.
// Deterministic offline fallback only: never calls a provider, always labelled aiGenerated:false.
// Operational use only (billing/price-transparency operations); no diagnosis or clinical advice.
export function buildInsights(records, context="Operational records"){
  const rows=Array.isArray(records)?records:[];
  const titleOf=r=>r?.title??r?.subject??"Untitled";
  const statusOf=r=>r?.status??r?.state??"";
  const amountOf=r=>{const n=Number(r?.amount);return Number.isFinite(n)?n:0;};
  const totalValue=rows.reduce((s,r)=>s+amountOf(r),0);
  const open=rows.filter(r=>!["Approved","Closed","closed","done"].includes(statusOf(r)));
  const highRisk=rows.filter(r=>["High","Critical"].includes(String(r?.risk||"")));
  const zeroValue=rows.filter(r=>amountOf(r)===0);
  const today=new Date().toISOString().slice(0,10);
  const overdue=open.filter(r=>r?.due_date && String(r.due_date).slice(0,10)<today);
  const base={aiGenerated:false,source:"deterministic-fallback",provider:"none",model:"deterministic-rules"};
  const summary={
    ...base,id:"portfolio-summary",label:"Portfolio summary",
    headline:`${context}: ${rows.length} record(s) under review`,
    summary: rows.length?`${open.length} open, ${highRisk.length} high-risk, total represented value ${totalValue}.`:"No records yet. Create the first operational case to populate this summary.",
    metrics:[{label:"Total records",value:rows.length},{label:"Open records",value:open.length},{label:"High-risk records",value:highRisk.length},{label:"Zero-value records",value:zeroValue.length},{label:"Total represented value",value:totalValue},{label:"Has high-risk records",value:highRisk.length>0}],
    sections:[{title:"Coverage",detail:`${rows.length} record(s) evaluated; ${zeroValue.length} carry a zero value and remain listed rather than hidden.`},{title:"Attention",detail: highRisk.length?`${highRisk.length} high-risk record(s) need reviewer attention.`:"No high-risk records at present."}],
    actions: open.length?["Review open records in due-date order","Confirm evidence for high-risk records"]:["No open actions; keep monitoring new records"],
  };
  const exceptions={
    ...base,id:"exception-flags",label:"Exception flags",
    headline:`${overdue.length+highRisk.length+zeroValue.length} exception signal(s) flagged`,
    summary:"Flags are rule-based checks over due dates, risk, and zero values. Empty and zero results are shown explicitly.",
    metrics:[{label:"Overdue open records",value:overdue.length},{label:"High-risk records",value:highRisk.length},{label:"Zero-value records",value:zeroValue.length},{label:"Any exception present",value:(overdue.length+highRisk.length+zeroValue.length)>0}],
    sections:[
      {title:"Overdue",detail: overdue.length?overdue.map(r=>`${r.reference||titleOf(r)} due ${String(r.due_date).slice(0,10)}`).join("; "):"None overdue (count: 0)."},
      {title:"High risk",detail: highRisk.length?highRisk.map(r=>r.reference||titleOf(r)).join("; "):"None flagged high-risk (count: 0)."},
      {title:"Zero value",detail: zeroValue.length?zeroValue.map(r=>r.reference||titleOf(r)).join("; "):"None with zero value (count: 0)."},
    ],
    actions: overdue.length?["Escalate overdue records to their owners"]:["No overdue escalation required"],
  };
  const ranked=[...open].sort((a,b)=>(["Critical","High","Moderate","Low"].indexOf(a.risk)-["Critical","High","Moderate","Low"].indexOf(b.risk))||amountOf(b)-amountOf(a));
  const priorities={
    ...base,id:"priority-actions",label:"Priority actions",
    headline: ranked.length?`Next priority: ${ranked[0].reference||titleOf(ranked[0])}`:"No open priorities",
    summary: ranked.length?"Open records ranked by risk, then represented value. This is a deterministic ordering, not a provider prediction.":"No open records to prioritise.",
    metrics:[{label:"Open records ranked",value:ranked.length},{label:"Top record value",value:ranked.length?amountOf(ranked[0]):0},{label:"Has open priority",value:ranked.length>0}],
    sections: ranked.slice(0,5).map((r,i)=>({title:`Priority ${i+1}: ${r.reference||titleOf(r)}`,detail:`Status ${statusOf(r)||"Not set"}; risk ${r.risk||"Not set"}; value ${amountOf(r)}; owner ${r.owner||"Unassigned"}.`})),
    actions: ranked.slice(0,3).map(r=>`Follow up ${r.reference||titleOf(r)} with ${r.owner||"the accountable owner"}`),
  };
  if(!priorities.sections.length) priorities.sections=[{title:"Priorities",detail:"No open records (count: 0)."}];
  if(!priorities.actions.length) priorities.actions=["Create or reopen an operational case"];
  return [summary,exceptions,priorities];
}
