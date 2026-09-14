import {FormEvent,useState} from "react";
import {ArrowRight,LockKeyhole,Mail,UserRound,CheckCircle2} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore";

export function Login(){
 const [mode,setMode]=useState<"login"|"register">("login");
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false);
 const {login,register,loading,error,clearError}=useAuthStore();
 const submit=async(e:FormEvent)=>{e.preventDefault();clearError();if(mode==="login")await login(email,password);else await register(name,email,password)};
 return <main className="auth-screen">
  <div className="auth-card">
   <div className="auth-brand">PLAN<span>X</span></div>
   <div className="auth-kicker">{mode==="login"?"Welcome back":"Create your workspace"}</div>
   <h1>{mode==="login"?"Sign in to PLANX":"Create your PLANX account"}</h1>
   <p className="auth-sub">{mode==="login"?"Sign in to access your tasks, projects, goals, habits and notes.":"Your account keeps your PLANX workspace separated from other local accounts."}</p>
   <form onSubmit={submit}>
    {mode==="register"&&<label><span>Name</span><div className="auth-input"><UserRound size={16}/><input autoComplete="name" value={name} onChange={(e:any)=>setName(e.target.value)} placeholder="Your name" required/></div></label>}
    <label><span>Email</span><div className="auth-input"><Mail size={16}/><input type="email" autoComplete="email" value={email} onChange={(e:any)=>setEmail(e.target.value)} placeholder="you@example.com" required/></div></label>
    <label><span>Password</span><div className="auth-input"><LockKeyhole size={16}/><input type={show?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={(e:any)=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required/><button type="button" className="auth-show" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div></label>
    {error&&<div className="auth-error">{error}</div>}
    <button className="primary auth-submit" disabled={loading}>{loading?"Please wait…":mode==="login"?"Sign in":"Create account"} <ArrowRight size={16}/></button>
   </form>
   <div className="auth-switch">{mode==="login"?"Don't have an account?":"Already have an account?"}<button onClick={()=>{setMode(mode==="login"?"register":"login");clearError()}}>{mode==="login"?"Create one":"Sign in"}</button></div>
   <div className="auth-note"><CheckCircle2 size={14}/> Local-first authentication. No password is sent to a server in this version.</div>
  </div>
 </main>
}
