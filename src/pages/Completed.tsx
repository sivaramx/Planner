import {usePlanxStore} from "../store/usePlanxStore";
import {TaskCard} from "../components/TaskCard";
export function Completed(){const tasks=usePlanxStore(s=>s.tasks).filter(t=>t.completed&&!t.archived);return <div className="page"><header className="page-header"><div><h1>Completed</h1><p>{tasks.length} completed tasks in your history.</p></div></header><div className="task-list">{tasks.map(t=><TaskCard key={t.id} task={t}/>)}{!tasks.length&&<div className="empty"><h3>Completed work will appear here.</h3></div>}</div></div>}
