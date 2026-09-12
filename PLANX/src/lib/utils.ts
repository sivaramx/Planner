export const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
export const isoDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const fmtDate=(s?:string)=>s?new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric"}).format(new Date(`${s}T00:00:00`)):"No date";
export const fmtLong=(d=new Date())=>new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(d);
export const greeting=()=>{const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening"};
export const priorityLabel=(p:string)=>({low:"Low",medium:"Medium",high:"High",urgent:"Urgent"}[p]??p);
export const clamp=(n:number,min=0,max=100)=>Math.min(max,Math.max(min,n));
export const daysBetween=(a:string,b:string)=>Math.round((new Date(`${b}T00:00:00`).getTime()-new Date(`${a}T00:00:00`).getTime())/86400000);
