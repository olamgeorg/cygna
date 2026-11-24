"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const inp="border rounded-lg px-3 py-2 w-full";
export default function Jobs(){
  const [uid,setUid]=useState(null);const [jobs,setJobs]=useState([]);const [m,setM]=useState("");const [open,setOpen]=useState(null);const [props,setProps]=useState({});
  const [f,setF]=useState({title:"",description:"",budget:"",deadline:""});const [p,setP]=useState({cover:"",price:"",days:""});
  async function load(){setJobs((await supabase.from("jobs").select("*").eq("status","open").order("created_at",{ascending:false})).data||[]);}
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUid(data.user?.id||null));load();},[]);
  const need=()=>{if(!uid){window.location.href="/auth";return false}return true};
  async function aiWrite(){setM("AI is writing…");const r=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mode:"job",messages:[{role:"user",content:`Job: ${f.title}. Notes: ${f.description}. Budget ₦${f.budget}`}]})});const d=await r.json();setF({...f,description:d.reply});setM("");}
  async function accept(j,x){const {data,error}=await supabase.from("contracts").insert({job_id:j.id,client_id:uid,freelancer_id:x.freelancer_id,title:j.title,amount:x.price}).select("id").single();if(error)return setM(error.message);
    await supabase.from("milestones").insert({contract_id:data.id,title:"Full delivery",amount:x.price});setM("Contract created ✓ — see Contracts.");}
  async function post(e){e.preventDefault();if(!need())return;const {error}=await supabase.from("jobs").insert({client_id:uid,title:f.title,description:f.description,budget:+f.budget||null,deadline:f.deadline||null});
    setM(error?error.message:"Job posted ✓");if(!error){setF({title:"",description:"",budget:"",deadline:""});load();}}
  async function propose(id){if(!need())return;const {error}=await supabase.from("proposals").insert({job_id:id,freelancer_id:uid,cover:p.cover,price:+p.price||null,days:+p.days||null});
    setM(error?error.message:"Proposal sent ✓");if(!error)setOpen(null);}
  async function view(id){const {data}=await supabase.from("proposals").select("*").eq("job_id",id);setProps({...props,[id]:data||[]});}
  return(<main className="max-w-3xl mx-auto px-4 py-6 sec-jobs"><h1 className="text-2xl font-bold mb-3">Jobs</h1>
    <form onSubmit={post} className="bg-[#F5F5F5] rounded-xl p-4 grid gap-2 mb-6"><h2 className="font-semibold">Post a job</h2>
      <input required placeholder="Job title" value={f.title} onChange={e=>setF({...f,title:e.target.value})} className={inp}/>
      <textarea placeholder="Describe the work, skills needed" value={f.description} onChange={e=>setF({...f,description:e.target.value})} className={inp}/>
      <div className="flex gap-2"><input type="number" placeholder="Budget ₦" value={f.budget} onChange={e=>setF({...f,budget:e.target.value})} className={inp}/><input type="date" value={f.deadline} onChange={e=>setF({...f,deadline:e.target.value})} className={inp}/></div>
      <button type="button" className="border rounded-lg px-3 py-2" onClick={aiWrite}>✨ AI help write job post</button><button className="btn-dark">Post job</button></form>
    {m&&<p className="text-sm mb-3 mint">{m}</p>}
    {jobs.map(j=><div key={j.id} className="bg-[#F5F5F5] rounded-xl p-4 mb-3"><h3 className="font-semibold">{j.title}</h3><p className="text-sm">{j.description}</p><p className="text-sm font-bold">{j.budget?naira(j.budget):"Budget open"}{j.deadline?` · due ${j.deadline}`:""}</p>
      <div className="flex gap-2 mt-2">{j.client_id===uid?<button className="btn-dark" onClick={()=>view(j.id)}>View proposals</button>:<button className="btn" onClick={()=>setOpen(open===j.id?null:j.id)}>Send proposal</button>}</div>
      {open===j.id&&<div className="grid gap-2 mt-2"><textarea placeholder="Cover letter" value={p.cover} onChange={e=>setP({...p,cover:e.target.value})} className={inp}/><div className="flex gap-2"><input type="number" placeholder="Your price ₦" value={p.price} onChange={e=>setP({...p,price:e.target.value})} className={inp}/><input type="number" placeholder="Days" value={p.days} onChange={e=>setP({...p,days:e.target.value})} className={inp}/></div><button className="btn-dark" onClick={()=>propose(j.id)}>Submit proposal</button></div>}
      {props[j.id]&&props[j.id].map(x=><p key={x.id} className="text-sm mt-2 bg-white rounded p-2">{naira(x.price)} · {x.days} days — {x.cover} <button className="btn ml-2" onClick={()=>accept(j,x)}>Accept</button></p>)}{props[j.id]&&!props[j.id].length&&<p className="text-sm mt-2">No proposals yet.</p>}</div>)}
    {!jobs.length&&<p>No open jobs yet.</p>}</main>);}
