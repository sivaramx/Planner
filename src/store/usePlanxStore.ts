import {create} from "zustand";
import type {AppData,Category,Goal,Habit,Note,Project,Task,Theme} from "../types";
import {isoDate,uid} from "../lib/utils";

const baseKey="planx-data-v2";
let activeKey=baseKey;
const now=new Date().toISOString(), today=isoDate();
const categories:Category[]=[
 {id:"college",name:"College",icon:"🎓"},{id:"coding",name:"Coding",icon:"💻"},
 {id:"freelancing",name:"Freelancing",icon:"💰"},{id:"ai",name:"AI / IGRIS",icon:"🤖"},
 {id:"learning",name:"Learning",icon:"📚"},{id:"projects",name:"Projects",icon:"🛠"},
 {id:"personal",name:"Personal",icon:"👤"}
];
const demoProjects:Project[]=[
 {id:"college-project",name:"College",description:"College work and study",categoryId:"college",status:"active",createdAt:now,updatedAt:now,archived:false},
 {id:"freelance-project",name:"Freelancing",description:"Skills, portfolio and client work",categoryId:"freelancing",status:"active",createdAt:now,updatedAt:now,archived:false},
 {id:"igris-project",name:"IGRIS",description:"Personal AI assistant",categoryId:"ai",status:"planning",createdAt:now,updatedAt:now,archived:false}
];
const demoTasks:Task[]=[
 {id:"demo-1",title:"Finish HTML notes",description:"Complete beginner HTML notes.",completed:false,priority:"high",categoryId:"coding",dueDate:today,tags:["html"],subtasks:[],notes:"",createdAt:now,updatedAt:now,order:0,status:"todo",archived:false},
 {id:"demo-2",title:"Practice C programs",description:"Loops and functions.",completed:true,priority:"medium",categoryId:"college",dueDate:today,tags:["c"],subtasks:[],notes:"",createdAt:now,updatedAt:now,completedAt:now,order:1,status:"done",archived:false},
 {id:"demo-3",title:"Learn Git commands",description:"Practice everyday Git commands.",completed:false,priority:"medium",categoryId:"coding",dueDate:today,tags:["git"],subtasks:[],notes:"",createdAt:now,updatedAt:now,order:2,status:"todo",archived:false},
 {id:"demo-4",title:"Plan IGRIS architecture",description:"Review the assistant architecture.",completed:false,priority:"urgent",categoryId:"ai",projectId:"igris-project",dueDate:today,dueTime:"20:00",tags:["igris"],subtasks:[{id:"s1",title:"Review provider abstraction",completed:false},{id:"s2",title:"Review permission engine",completed:false}],notes:"",createdAt:now,updatedAt:now,order:3,status:"in-progress",archived:false}
];
const defaults:AppData={tasks:demoTasks,projects:demoProjects,goals:[],habits:[],notes:[],categories:categories,theme:"system",onboardingComplete:true,settings:{compact:false,animations:true,notifications:false,deadlineReminders:true,dailySummary:false,weekStartsOn:1,defaultPriority:"medium",defaultCategory:"coding"}};

function load(key=activeKey):AppData{
 try{const raw=localStorage.getItem(key);if(!raw)return {...defaults, tasks:[...defaults.tasks], projects:[...defaults.projects], categories:[...defaults.categories]};
 const x=JSON.parse(raw);return {...defaults,...x,settings:{...defaults.settings,...x.settings}};
 }catch{return {...defaults}};
}
const save=(d:AppData)=>{try{localStorage.setItem(activeKey,JSON.stringify(d))}catch(e){console.warn("PLANX storage error",e)}};


interface Store extends AppData{
 addTask:(t:Omit<Task,"id"|"createdAt"|"updatedAt"|"order">)=>void; updateTask:(id:string,p:Partial<Task>)=>void;
 toggleTask:(id:string)=>void; deleteTask:(id:string)=>void; archiveTask:(id:string)=>void; duplicateTask:(id:string)=>void;
 addProject:(p:Omit<Project,"id"|"createdAt"|"updatedAt">)=>void; updateProject:(id:string,p:Partial<Project>)=>void;
 addGoal:(g:Omit<Goal,"id"|"createdAt"|"updatedAt">)=>void; addHabit:(h:Omit<Habit,"id"|"createdAt">)=>void;
 toggleHabitDate:(id:string,date:string)=>void; addNote:(n:Omit<Note,"id"|"createdAt"|"updatedAt">)=>void;
 addCategory:(c:Omit<Category,"id">)=>void; setTheme:(t:Theme)=>void; updateSettings:(p:Partial<AppData["settings"]>)=>void;
 clearAll:()=>void; replaceData:(d:AppData)=>void; clearDemo:()=>void; switchUser:(userId:string)=>void;
}
const loaded=load();
export const usePlanxStore=create<Store>((set)=>({
 ...loaded,
 addTask:t=>set(s=>{const d={...s,tasks:[...s.tasks,{...t,id:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),order:s.tasks.length}]};save(d);return d}),
 updateTask:(id,p)=>set(s=>{const d={...s,tasks:s.tasks.map(t=>t.id===id?{...t,...p,updatedAt:new Date().toISOString()}:t)};save(d);return d}),
 toggleTask:id=>set(s=>{const d={...s,tasks:s.tasks.map(t=>{if(t.id!==id)return t;const c=!t.completed;return {...t,completed:c,status:c?"done":"todo",completedAt:c?new Date().toISOString():undefined,updatedAt:new Date().toISOString()}})};save(d);return d}),
 deleteTask:id=>set(s=>{const d={...s,tasks:s.tasks.filter(t=>t.id!==id)};save(d);return d}),
 archiveTask:id=>set(s=>{const d={...s,tasks:s.tasks.map(t=>t.id===id?{...t,archived:true,updatedAt:new Date().toISOString()}:t)};save(d);return d}),
 duplicateTask:id=>set(s=>{const t=s.tasks.find(x=>x.id===id);if(!t)return s;const copy:Task={...t,id:uid(),title:`${t.title} (copy)`,completed:false,status:"todo",completedAt:undefined,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),order:s.tasks.length};const d={...s,tasks:[...s.tasks,copy]};save(d);return d}),
 addProject:p=>set(s=>{const d={...s,projects:[...s.projects,{...p,id:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]};save(d);return d}),
 updateProject:(id,p)=>set(s=>{const d={...s,projects:s.projects.map(x=>x.id===id?{...x,...p,updatedAt:new Date().toISOString()}:x)};save(d);return d}),
 addGoal:g=>set(s=>{const d={...s,goals:[...s.goals,{...g,id:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]};save(d);return d}),
 addHabit:h=>set(s=>{const d={...s,habits:[...s.habits,{...h,id:uid(),createdAt:new Date().toISOString()}]};save(d);return d}),
 toggleHabitDate:(id,date)=>set(s=>{const d={...s,habits:s.habits.map(h=>h.id===id?{...h,completedDates:h.completedDates.includes(date)?h.completedDates.filter(x=>x!==date):[...h.completedDates,date]}:h)};save(d);return d}),
 addNote:n=>set(s=>{const d={...s,notes:[...s.notes,{...n,id:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]};save(d);return d}),
 addCategory:c=>set(s=>{const d={...s,categories:[...s.categories,{...c,id:uid()}]};save(d);return d}),
 setTheme:theme=>set(s=>{const d={...s,theme};save(d);return d}),
 updateSettings:p=>set(s=>{const d={...s,settings:{...s.settings,...p}};save(d);return d}),
 clearAll:()=>set(s=>{const d={...s,tasks:[],projects:[],goals:[],habits:[],notes:[],onboardingComplete:true};save(d);return d}),
 clearDemo:()=>set(s=>{const d={...s,tasks:[],projects:[],goals:[],habits:[],notes:[],onboardingComplete:true};save(d);return d}),
 replaceData:d=>set(()=>{save(d);return d}),
 switchUser:userId=>set(()=>{activeKey=`${baseKey}:${userId}`;const existing=localStorage.getItem(activeKey);if(!existing){const legacy=localStorage.getItem(baseKey);if(legacy){try{localStorage.setItem(activeKey,legacy)}catch{}}}const d=load(activeKey);save(d);return d})
}));
