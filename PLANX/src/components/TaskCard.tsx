import {Calendar,Clock3,MoreHorizontal,Trash2,Copy,Archive,RotateCcw} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
import {fmtDate,priorityLabel} from "../lib/utils";
import type {Task} from "../types";
export function TaskCard({task}:{task:Task}){
 const {toggleTask,deleteTask,archiveTask,duplicateTask,updateTask}=usePlanxStore();
 const cats=usePlanxStore(s=>s.categories),cat=cats.find(c=>c.id===task.categoryId);
 return <div className={`task-card ${task.completed?"completed":""}`}>
  <button className={`check ${task.completed?"checked":""}`} onClick={()=>toggleTask(task.id)} aria-label="Toggle task">{task.completed?"✓":""}</button>
  <div className="task-main"><div className="task-title-row"><strong>{task.title}</strong><span className={`priority ${task.priority}`}>{priorityLabel(task.priority)}</span></div>
   {task.description&&<p className="task-desc">{task.description}</p>}
   <div className="task-meta">{task.dueDate&&<span><Calendar size={13}/>{fmtDate(task.dueDate)}</span>}{task.dueTime&&<span><Clock3 size={13}/>{task.dueTime}</span>}{cat&&<span>{cat.icon} {cat.name}</span>}{task.projectId&&<span>Project</span>}{task.subtasks.length>0&&<span>{task.subtasks.filter(x=>x.completed).length}/{task.subtasks.length} subtasks</span>}</div>
  </div>
  <div className="task-actions">
   <button className="icon-btn" title="Duplicate" onClick={()=>duplicateTask(task.id)}><Copy size={15}/></button>
   <button className="icon-btn" title="Move to in progress" onClick={()=>updateTask(task.id,{status:task.status==="todo"?"in-progress":"todo"})}><MoreHorizontal size={16}/></button>
   <button className="icon-btn" title={task.archived?"Restore":"Archive"} onClick={()=>archiveTask(task.id)}>{task.archived?<RotateCcw size={15}/>:<Archive size={15}/>}</button>
   <button className="icon-btn danger" title="Delete" onClick={()=>{if(confirm("Delete this task permanently?"))deleteTask(task.id)}}><Trash2 size={15}/></button>
  </div>
 </div>
}
