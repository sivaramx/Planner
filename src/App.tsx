import {useEffect,useState} from "react";
import {Menu,Search,Focus} from "lucide-react";
import {Sidebar} from "./components/Sidebar";
import {TaskModal} from "./components/TaskModal";
import {CommandPalette} from "./components/CommandPalette";
import {Dashboard} from "./pages/Dashboard";
import {Tasks} from "./pages/Tasks";
import {Today} from "./pages/Today";
import {CalendarPage} from "./pages/CalendarPage";
import {Projects} from "./pages/Projects";
import {Goals} from "./pages/Goals";
import {Habits} from "./pages/Habits";
import {Notes} from "./pages/Notes";
import {Completed} from "./pages/Completed";
import {Archive} from "./pages/Archive";
import {Settings} from "./pages/Settings";
import {Account} from "./pages/Account";
import {Login} from "./pages/Login";
import {FocusMode} from "./pages/FocusMode";
import {usePlanxStore} from "./store/usePlanxStore";
import {useAuthStore} from "./store/useAuthStore";

export default function App(){
 const user=useAuthStore(s=>s.user);
 const switchUser=usePlanxStore(s=>s.switchUser);
 const theme=usePlanxStore(s=>s.theme);
 const animations=usePlanxStore(s=>s.settings.animations);
 const [page,setPage]=useState("Dashboard"),[sidebar,setSidebar]=useState(false),[modal,setModal]=useState(false),[cmd,setCmd]=useState(false),[focus,setFocus]=useState(false);

 useEffect(()=>{if(user)switchUser(user.id)},[user?.id,switchUser]);

 useEffect(()=>{const apply=()=>{const dark=theme==="dark"||(theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.body.classList.toggle("dark",dark)};apply();if(theme==="system"){const m=matchMedia("(prefers-color-scheme: dark)");m.addEventListener("change",apply);return()=>m.removeEventListener("change",apply)}},[theme]);

 useEffect(()=>{document.documentElement.classList.toggle("no-animations",!animations)},[animations]);

 useEffect(()=>{const open=()=>setModal(true),openAccount=()=>setPage("Account"),key=(e:KeyboardEvent)=>{const target=e.target as HTMLElement;if(target?.tagName==="INPUT"||target?.tagName==="TEXTAREA")return;if(e.key.toLowerCase()==="n"){e.preventDefault();setModal(true)}if(e.key==="/"){e.preventDefault();setPage("Tasks");setTimeout(()=>document.querySelector<HTMLInputElement>(".search-box input")?.focus(),30)}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCmd(true)}if(e.key.toLowerCase()==="t")setPage("Today");if(e.key.toLowerCase()==="c")setPage("Calendar");if(e.key.toLowerCase()==="p")setPage("Projects");if(e.key==="Escape"){setSidebar(false);setCmd(false);setModal(false);setFocus(false)}};addEventListener("planx:add-task",open);addEventListener("planx:open-account",openAccount);addEventListener("keydown",key);return()=>{removeEventListener("planx:add-task",open);removeEventListener("planx:open-account",openAccount);removeEventListener("keydown",key)}},[]);

 if(!user)return <Login />;
 let content=page==="Dashboard"?<Dashboard setPage={setPage}/>:page==="Tasks"?<Tasks/>:page==="Today"?<Today/>:page==="Calendar"?<CalendarPage/>:page==="Projects"?<Projects/>:page==="Goals"?<Goals/>:page==="Habits"?<Habits/>:page==="Notes"?<Notes/>:page==="Completed"?<Completed/>:page==="Archive"?<Archive/>:page==="Account"?<Account/>:<Settings/>;
 if(focus)return <FocusMode close={()=>setFocus(false)}/>;
 return <><Sidebar page={page} setPage={setPage} open={sidebar} onClose={()=>setSidebar(false)}/><main className="main"><header className="mobile-header"><button className="icon-btn" onClick={()=>setSidebar(true)}><Menu/></button><strong>PLANX</strong><div><button className="icon-btn" onClick={()=>setCmd(true)}><Search/></button><button className="icon-btn" onClick={()=>setFocus(true)}><Focus/></button></div></header>{content}</main><TaskModal open={modal} onClose={()=>setModal(false)}/><CommandPalette open={cmd} close={()=>setCmd(false)} setPage={setPage} startFocus={()=>setFocus(true)}/></>
}
