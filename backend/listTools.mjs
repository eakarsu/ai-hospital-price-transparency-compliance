// Search/filter + export helpers for the main record list. Pure functions; no provider calls.
export const EXPORT_COLUMNS = ["id","reference","title","status","owner","risk","due_date","amount"];
export function recordTitle(r){return r?.title ?? r?.subject ?? "";}
export function recordStatus(r){return r?.status ?? r?.state ?? "";}
export function filterRecords(rows,{q="",status="",risk=""}={}){
  const needle=String(q||"").trim().toLowerCase();
  return (rows||[]).filter(r=>{
    if(status && recordStatus(r)!==status) return false;
    if(risk && String(r?.risk||"")!==risk) return false;
    if(!needle) return true;
    const hay=[r?.reference,recordTitle(r),r?.owner,recordStatus(r),r?.risk,r?.workflow_id,r?.feature_id,JSON.stringify(r?.payload??"")].join(" ").toLowerCase();
    return hay.includes(needle);
  });
}
function csvCell(v){
  if(v===null||v===undefined) return "";
  const s=typeof v==="object"?JSON.stringify(v):String(v); // preserves 0 and false as "0"/"false"
  return /[",\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;
}
export function recordsToCsv(rows,columns=EXPORT_COLUMNS){
  const lines=[columns.join(",")];
  for(const r of rows||[]){
    lines.push(columns.map(c=>{
      const v=c==="title"?recordTitle(r):c==="status"?recordStatus(r):r?.[c];
      return csvCell(v);
    }).join(","));
  }
  return lines.join("\n")+"\n";
}
export function recordsToJson(rows){return JSON.stringify(rows??[],null,2);}
