import {useMemo,useState} from "react";
import {addMonths,startOfMonth,endOfMonth,startOfWeek,endOfWeek,eachDayOfInterval,isSameMonth,isSameDay,format,subMonths} from "date-fns";
import {ChevronLeft,ChevronRight,Plus} from "lucide-react";
import {usePlanxStore} from "../store/usePlanxStore";
export function CalendarView(){
 const tasks=usePlanxStore(s=>s.tasks).filter(t=>!t.archived),[month,setMonth]=useState(new Date());
 const days=useMemo(()=>eachDayOfInterval({start:startOfWeek(startOfMonth(month),{weekStartsOn:1}),end:endOfWeek(endOfMonth(month),{weekStartsOn:1})}),[month]);
 return <div className="calendar"><div className="calendar-head"><button className="icon-btn" onClick={()=>setMonth(subMonths(month,1))}><ChevronLeft/></button><h2>{format(month,"MMMM yyyy")}</h2><button className="icon-btn" onClick={()=>setMonth(addMonths(month,1))}><ChevronRight/></button><button className="primary" onClick={()=>dispatchEvent(new CustomEvent("planx:add-task"))}><Plus size={15}/> Task</button></div>
 <div className="weekdays">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x=><span key={x}>{x}</span>)}</div><div className="calendar-grid">{days.map(d=>{const ts=tasks.filter(t=>t.dueDate&&isSameDay(new Date(`${t.dueDate}T00:00:00`),d));return <div className={`cal-day ${isSameMonth(d,month)?"":"muted"} ${isSameDay(d,new Date())?"today":""}`} key={d.toISOString()}><div className="day-num">{format(d,"d")}</div>{ts.slice(0,3).map(t=><button className={`cal-task ${t.completed?"done":""}`} key={t.id}>{t.title}</button>)}{ts.length>3&&<small>+{ts.length-3} more</small>}</div>})}</div></div>
}
