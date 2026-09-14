import {useState} from "react";
import {CalendarDays,Mail,ShieldCheck,UserRound,Save} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore";
import {usePlanxStore} from "../store/usePlanxStore";

export function Account(){
 const {user,updateProfile}=useAuthStore();
 const store=usePlanxStore();
 const [name,setName]=useState(user?.name||"");
 const [email,setEmail]=useState(user?.email||"");
 if(!user)return null;
 const done=store.tasks.filter(t=>t.completed).length;
 const total=store.tasks.filter(t=>!t.archived).length;
 const progress=total?Math.round(done/total*100):0;
 const joined=new Date(user.createdAt).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
 const save=()=>updateProfile({name,email});
 return <div className="page">
  <header className="page-header"><div><div className="eyebrow">Profile</div><h1>Your account</h1><p>Your PLANX identity and personal workspace information.</p></div></header>
  <div className="account-layout">
   <section className="account-hero settings-card">
    <div className="account-avatar">{user.name.trim().charAt(0).toUpperCase()}</div>
    <div><h2>{user.name}</h2><p>{user.email}</p><span className="account-badge"><ShieldCheck size={13}/> {user.role}</span></div>
   </section>
   <section className="settings-card"><h2>Account information</h2><p>These details belong to your local PLANX account.</p>
    <label className="account-field"><span><UserRound size={14}/> Full name</span><input value={name} onChange={e=>setName(e.target.value)} /></label>
    <label className="account-field"><span><Mail size={14}/> Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <div className="account-meta"><span><CalendarDays size={14}/> Joined</span><strong>{joined}</strong></div>
    <button className="primary" onClick={save}><Save size={15}/> Save profile</button>
   </section>
   <section className="settings-card"><h2>Workspace overview</h2><p>Your information and activity from the signed-in local workspace.</p>
    <div className="account-stats"><div><strong>{total}</strong><span>Active tasks</span></div><div><strong>{done}</strong><span>Completed</span></div><div><strong>{progress}%</strong><span>Completion</span></div><div><strong>{store.projects.length}</strong><span>Projects</span></div></div>
   </section>
   <section className="settings-card"><h2>Data ownership</h2><p>PLANX currently stores your workspace locally in this browser, separated by your account ID. This login is a local account system, not a cloud authentication service.</p><div className="future-list"><span>✓ Your workspace is separated per account</span><span>✓ Refresh keeps your session</span><span>✓ Logout protects the current screen</span><span>○ Cloud sync requires a backend later</span></div></section>
  </div>
 </div>
}
