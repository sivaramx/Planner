import {FormEvent,useEffect,useState} from "react";
import {X,Plus,Trash2} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
import {isoDate,uid} from "../lib/utils";
import type {Priority,Subtask} from "../types";
export function TaskModal({open,onClose}:{open:boolean;onClose:()=>void}){
 const add=usePlanxStore(s=>s.addTask),cats=usePlanxStore(s=>s.categories),projects=usePlanxStore(s=>s.projects),settings=usePlanxStore(s=>s.settings);
 const [title,setTitle]=useState(""),[description,setDescription]=useState(""),[dueDate,setDueDate]=useState(isoDate()),[dueTime,setDueTime]=useState("");
 const [priority,setPriority]=useState<Priority>(settings.defaultPriority),[categoryId,setCategoryId]=useState(settings.defaultCategory),[projectId,setProjectId]=useState("");
 const [duration,setDuration]=useState(""),[repeat,setRepeat]=useState("none"),[tags,setTags]=useState(""),[subs,setSubs]=useState<Subtask[]>([]),[sub,setSub]=useState("");
 useEffect(()=>{if(!open)return;const f=(e:KeyboardEvent)=>e.key==="Escape"&&onClose();addEventListener("keydown",f);return()=>removeEventListener("keydown",f)},[open,onClose]);
 useEffect(()=>{if(open){setPriority(settings.defaultPriority);setCategoryId(settings.defaultCategory)}},[open,settings]);
 if(!open)return null;
 const addSub=()=>{if(sub.trim()){setSubs(x=>[...x,{id:uid(),title:sub.trim(),completed:false}]);setSub("")}};
 const submit=(e:FormEvent)=>{e.preventDefault();if(!title.trim())return;add({title:title.trim(),description,completed:false,priority,categoryId,projectId:projectId||undefined,dueDate:dueDate||undefined,dueTime:dueTime||undefined,durationMinutes:duration?Number(duration):undefined,repeatRule:{type:repeat as any},tags:tags.split(",").map(x=>x.trim()).filter(Boolean),subtasks:subs,notes:"",status:"todo",archived:false});setTitle("");setDescription("");setSubs([]);setSub("");onClose()};
 return <div className="modal-backdrop" onMouseDown={e=>e.currentTarget===e.target&&onClose()}><form className="modal" onSubmit={submit}>
  <div className="modal-head"><div><h2>New task</h2><p>Fast capture, then organize only as much as you need.</p></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></div>
  <label>Task title<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder='e.g. "Study C tomorrow at 7 PM"' required/></label>
  <label>Description<textarea rows={2} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional details"/></label>
  <div className="form-grid">
   <label>Due date<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></label><label>Due time<input type="time" value={dueTime} onChange={e=>setDueTime(e.target.value)}/></label>
   <label>Duration (min)<input type="number" min="0" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="60"/></label>
   <label>Priority<select value={priority} onChange={e=>setPriority(e.target.value as Priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
   <label>Category<select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>{cats.map(c=><option value={c.id} key={c.id}>{c.icon} {c.name}</option>)}</select></label>
   <label>Project<select value={projectId} onChange={e=>setProjectId(e.target.value)}><option value="">No project</option>{projects.filter(p=>!p.archived).map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
   <label>Repeat<select value={repeat} onChange={e=>setRepeat(e.target.value)}><option value="none">None</option><option value="daily">Daily</option><option value="weekdays">Weekdays</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
   <label>Tags<input value={tags} onChange={e=>setTags(e.target.value)} placeholder="coding, college"/></label>
  </div>
  <div className="subtask-editor"><div className="label-line"><span>Subtasks</span><small>{subs.length}</small></div><div className="inline-add"><input value={sub} onChange={e=>setSub(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addSub())} placeholder="Add a subtask"/><button type="button" onClick={addSub}><Plus size={17}/></button></div>{subs.map(s=><div className="sub-row" key={s.id}><span>☐ {s.title}</span><button type="button" onClick={()=>setSubs(x=>x.filter(y=>y.id!==s.id))}><Trash2 size={14}/></button></div>)}</div>
  <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Create task</button></div>
 </form></div>
}
