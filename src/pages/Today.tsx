import {usePlanxStore} from "../store/usePlanxStore";
import {TaskCard} from "../components/TaskCard";
import {isoDate} from "../lib/utils";
export function Today(){
 const tasks=usePlanxStore(s=>s.tasks).filter(t=>!t.archived&&t.dueDate===isoDate()),groups=[["Morning","00:00","11:59"],["Afternoon","12:00","16:59"],["Evening","17:00","20:59"],["Night","21:00","23:59"]];
 return <div className="page"><header className="page-header"><div><h1>Today</h1><p>Time-focused view for {isoDate()}.</p></div><button className="primary" onClick={()=>dispatchEvent(new CustomEvent("planx:add-task"))}>+ Add Task</button></header>
 <div className="timeline">{groups.map(([name,a,b])=>{const xs=tasks.filter(t=>t.dueTime&&t.dueTime>=a&&t.dueTime<=b);return <section key={name}><h2>{name}</h2>{xs.length?xs.map(t=><TaskCard key={t.id} task={t}/>):<div className="timeline-empty">Nothing scheduled.</div>}</section>})}<section><h2>No-time tasks</h2>{tasks.filter(t=>!t.dueTime).map(t=><TaskCard key={t.id} task={t}/>)}{!tasks.some(t=>!t.dueTime)&&<div className="timeline-empty">No unscheduled tasks.</div>}</section></div></div>
}
