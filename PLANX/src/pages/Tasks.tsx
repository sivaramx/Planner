import {useMemo,useState} from "react";
import {Search,List,Kanban,CalendarDays,Plus} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
import {TaskCard} from "../components/TaskCard";
export function Tasks(){
 const tasks=usePlanxStore(s=>s.tasks),[q,setQ]=useState(""),[filter,setFilter]=useState("All"),[view,setView]=useState("List"),today=new Date().toISOString().slice(0,10);
 const visible=useMemo(()=>tasks.filter(t=>!t.archived).filter(t=>{const s=q.toLowerCase(),match=!s||t.title.toLowerCase().includes(s)||t.description.toLowerCase().includes(s)||t.tags.some(x=>x.toLowerCase().includes(s));const f=filter==="All"||(filter==="Today"&&t.dueDate===today)||(filter==="Upcoming"&&!!t.dueDate&&t.dueDate>today&&!t.completed)||(filter==="Overdue"&&!!t.dueDate&&t.dueDate<today&&!t.completed)||(filter==="Completed"&&t.completed)||(filter==="High Priority"&&(t.priority==="high"||t.priority==="urgent"));return match&&f}),[tasks,q,filter,today]);
 return <div className="page"><header className="page-header"><div><h1>Tasks</h1><p>Capture, prioritize and finish your work.</p></div><button className="primary" onClick={()=>dispatchEvent(new CustomEvent("planx:add-task"))}><Plus size={15}/> Add Task</button></header>
 <div className="toolbar"><div className="search-box"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks..."/><kbd>/</kbd></div><div className="filters">{["All","Today","Upcoming","Overdue","Completed","High Priority"].map(x=><button className={filter===x?"selected":""} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div><div className="view-switch">{[[List,"List"],[Kanban,"Board"],[CalendarDays,"Calendar"]].map(([I,x])=><button key={x as string} className={view===x?"selected":""} onClick={()=>setView(x as string)}><I size={16}/></button>)}</div></div>
 {view==="List"?<div className="task-list">{visible.map(t=><TaskCard key={t.id} task={t}/>)}{!visible.length&&<div className="empty"><h3>No matching tasks</h3><p>Try another filter or create a new task.</p></div>}</div>:<div className="board"><Column title="To Do" tasks={visible.filter(t=>t.status==="todo")}/><Column title="In Progress" tasks={visible.filter(t=>t.status==="in-progress")}/><Column title="Done" tasks={visible.filter(t=>t.status==="done")}/></div>}
 </div>
}
function Column({title,tasks}:{title:string;tasks:any[]}){return <div className="board-col"><div className="board-title"><strong>{title}</strong><span>{tasks.length}</span></div>{tasks.map(t=><TaskCard task={t} key={t.id}/>)}</div>}
