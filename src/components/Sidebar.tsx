import {LayoutDashboard,CheckSquare,CalendarDays,FolderKanban,Target,Flame,NotebookPen,CheckCircle2,Archive,Settings,Plus,PanelLeftClose,UserRound,LogOut} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
import {useAuthStore} from "../store/useAuthStore";
const nav=[["Dashboard",LayoutDashboard],["Tasks",CheckSquare],["Today",CheckSquare],["Calendar",CalendarDays],["Projects",FolderKanban],["Goals",Target],["Habits",Flame],["Notes",NotebookPen],["Completed",CheckCircle2],["Archive",Archive],["Account",UserRound],["Settings",Settings]] as const;
export function Sidebar({page,setPage,open,onClose}:{page:string;setPage:(x:string)=>void;open:boolean;onClose:()=>void}){
 const user=useAuthStore(s=>s.user),logout=useAuthStore(s=>s.logout);
 const tasks=usePlanxStore(s=>s.tasks).filter(t=>!t.archived),done=tasks.filter(t=>t.completed).length,today=new Date().toISOString().slice(0,10),todayCount=tasks.filter(t=>t.dueDate===today&&!t.completed).length,pct=tasks.length?Math.round(done/tasks.length*100):0;
 return <aside className={`sidebar ${open?"open":""}`}><div className="brand-row"><div className="brand">PLAN<span>X</span></div><button className="icon-btn mobile-only" onClick={onClose}><PanelLeftClose size={18}/></button></div>
 <button className="profile profile-button" onClick={()=>{setPage("Account");onClose()}}><div className="avatar">{user?.name?.trim().charAt(0).toUpperCase()||"P"}</div><div><strong>{user?.name||"User"}</strong><small>{user?.email||"Personal workspace"}</small></div><UserRound className="profile-chevron" size={14}/></button>
 <nav>{nav.map(([label,I])=><button className={`nav-item ${page===label?"active":""}`} key={label} onClick={()=>{setPage(label);onClose()}}><I size={17}/><span>{label}</span>{label==="Today"&&todayCount>0&&<b>{todayCount}</b>}</button>)}</nav>
 <div className="sidebar-bottom"><div className="mini-progress"><div><span>Overall completion</span><strong>{pct}%</strong></div><div className="progress"><i style={{width:`${pct}%`}}/></div><small>{done} completed · {Math.max(tasks.length-done,0)} remaining</small></div><button className="quick-add" onClick={()=>dispatchEvent(new CustomEvent("planx:add-task"))}><Plus size={17}/> Add task <kbd>N</kbd></button><button className="sidebar-logout" onClick={logout}><LogOut size={15}/> Sign out</button></div>
 </aside>
}
