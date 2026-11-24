"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
export default function Contracts(){
  const [uid,setUid]=useState(null);const [cs,setCs]=useState([]);const [ms,setMs]=useState([]);const [m,setM]=useState("");
  async function load(){setCs((await supabase.from("contracts").select("*").order("created_at",{ascending:false})).data||[]);setMs((await supabase.from("milestones").select("*")).data||[]);}
  useEffect(()=>{supabase.auth.getUser().then(({data})=>{if(!data.user){window.location.href="/auth";return}setUid(data.user.id);load();});},[]);
  async function set(id,status){const {error}=await supabase.from("milestones").update({status}).eq("id",id);setM(error?error.message:"Updated ✓");load();}
  return(<main className="max-w-3xl mx-auto px-4 py-6 sec-jobs"><h1 className="text-2xl font-bold mb-3">Contracts &amp; milestones</h1>{m&&<p className="mint mb-3 text-sm">{m}</p>}
    {cs.map(c=><div key={c.id} className="bg-[#F5F5F5] rounded-xl p-4 mb-3"><h2 className="font-semibold">{c.title} — {naira(c.amount)}</h2><p className="text-xs mb-2">You are the {c.client_id===uid?"client":"freelancer"}</p>
      {ms.filter(x=>x.contract_id===c.id).map(x=><div key={x.id} className="flex justify-between items-center text-sm bg-white rounded p-2 mb-1"><span>{x.title} · {naira(x.amount)} · <b>{x.status}</b></span>
        {c.freelancer_id===uid&&x.status==="pending"&&<button className="btn" onClick={()=>set(x.id,"delivered")}>Mark delivered</button>}
        {c.client_id===uid&&x.status==="delivered"&&<button className="btn" onClick={()=>set(x.id,"approved")}>Approve &amp; release</button>}</div>)}</div>)}
    {!cs.length&&<p>No contracts yet. Accept a proposal on a job to start one.</p>}
    <p className="text-xs mt-3">Payment is by bank transfer through Cygna (see /pay). Admin releases funds after approval.</p></main>);}
