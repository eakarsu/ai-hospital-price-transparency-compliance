import React,{useEffect,useState} from "react";
export default function TasksPanel({request,notify}){
  const [tasks,setTasks]=useState([]),[title,setTitle]=useState(""),[error,setError]=useState("");
  async function load(){try{const d=await request("/api/tasks");setTasks(d.tasks||[]);}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  async function create(ev){ev.preventDefault();if(!title.trim())return;try{await request("/api/tasks",{method:"POST",body:JSON.stringify({title:title.trim()})});setTitle("");notify?.("Task created");await load();}catch(e){setError(e.message);}}
  async function update(task,status){try{await request(`/api/tasks/${task.id}`,{method:"PATCH",body:JSON.stringify({status})});await load();}catch(e){setError(e.message);}}
  return <section className="panel" aria-label="Staff tasks"><div className="moduleTitle"><div><h3>Staff tasks</h3><p>Authenticated follow-ups stored in PostgreSQL. Completed and cancelled tasks remain listed.</p></div><span className="badge">{tasks.length} tasks</span></div>
  {error&&<p className="error" role="alert">{error}</p>}
  <form onSubmit={create} className="buttonRow"><input aria-label="New task title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title"/><button className="primary" type="submit">Create task</button></form>
  {tasks.length?<div className="tableWrap"><table><thead><tr><th>Task</th><th>Status</th><th>Priority</th><th>Due</th><th>Actions</th></tr></thead><tbody>{tasks.map(t=><tr key={t.id}><td>{t.title}</td><td>{t.status}</td><td>{t.priority}</td><td>{t.due_at?String(t.due_at).slice(0,10):"Not set"}</td><td><button type="button" className="secondary" onClick={()=>update(t,t.status==="DONE"?"OPEN":"DONE")}>{t.status==="DONE"?"Reopen":"Mark done"}</button></td></tr>)}</tbody></table></div>:<p className="muted">No tasks yet (count: 0).</p>}</section>;
}
