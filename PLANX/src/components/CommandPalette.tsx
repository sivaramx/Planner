import {useEffect,useState} from "react";
import {Search,X} from "lucide-react";
export function CommandPalette({open,close,setPage,startFocus}:{open:boolean;close:()=>void;setPage:(x:string)=>void;startFocus:()=>void}){
 const [q,setQ]=useState("");useEffect(()=>{if(!open)return;const f=(e:KeyboardEvent)=>{if(e.key==="Escape")close()};addEventListener("keydown",f);return()=>removeEventListener("keydown",f)},[open,close]);if(!open)return null;
 const items=[["Create task",()=>{close();dispatchEvent(new CustomEvent("planx:add-task"))}],["Dashboard",()=>{setPage("Dashboard");close()}],["Today",()=>{setPage("Today");close()}],["Calendar",()=>{setPage("Calendar");close()}],["Projects",()=>{setPage("Projects");close()}],["Goals",()=>{setPage("Goals");close()}],["Focus mode",()=>{startFocus();close()}],["Settings",()=>{setPage("Settings");close()}]].filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));
 return <div className="modal-backdrop" onMouseDown={e=>e.currentTarget===e.target&&close()}><div className="command"><div className="search-box"><Search size={16}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Type a command..."/><button className="icon-btn" onClick={close}><X size={16}/></button></div>{items.map(([name,fn])=><button className="command-item" key={name} onClick={fn as any}>{name}</button>)}</div></div>
}
