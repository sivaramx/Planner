import {useState} from "react";
import {Plus,FolderKanban} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
export function Projects(){
 const {projects,addProject,tasks,categories}=usePlanxStore(),[name,setName]=useState("");
 const active=projects.filter(p=>!p.archived);
 const create=()=>{if(name.trim()){addProject({name:name.trim(),description:"",categoryId:"projects",status:"active",archived:false});setName("")}};
 return <div className="page"><header className="page-header"><div><h1>Projects</h1><p>Group work into outcomes that matter.</p></div></header><div className="inline-create"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&create()} placeholder="New project name"/><button className="primary" onClick={create}><Plus size={15}/> Create</button></div><div className="card-grid">{active.map(p=>{const ts=tasks.filter(t=>t.projectId===p.id&&!t.archived),done=ts.filter(t=>t.completed).length,pct=ts.length?Math.round(done/ts.length*100):0,cat=categories.find(c=>c.id===p.categoryId);return <div className="project-card" key={p.id}><div className="project-icon"><FolderKanban size={18}/></div><div className="project-head"><h2>{p.name}</h2><span>{cat?.icon} {p.status}</span></div><p>{p.description||"No description yet."}</p><div className="progress"><i style={{width:`${pct}%`}}/></div><div className="project-foot"><span>{done}/{ts.length} tasks</span><strong>{pct}%</strong></div></div>})}{!active.length&&<div className="empty"><h3>Create your first project.</h3></div>}</div></div>
}
