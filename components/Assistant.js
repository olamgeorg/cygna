"use client";
import { useState } from "react";
export default function Assistant(){
  const [open,setOpen]=useState(false);const [msgs,setMsgs]=useState([{role:"assistant",content:"Hi! I'm Cygna AI. Ask me about products, cars, homes or services in Lagos."}]);const [t,setT]=useState("");const [busy,setBusy]=useState(false);
  async function send(e){e.preventDefault();if(!t.trim()||busy)return;const next=[...msgs,{role:"user",content:t}];setMsgs(next);setT("");setBusy(true);
    try{const r=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:next.slice(1)})});const d=await r.json();setMsgs([...next,{role:"assistant",content:d.reply}]);}
    catch{setMsgs([...next,{role:"assistant",content:"Network error. Please try again."}]);}setBusy(false);}
  return(<><button onClick={()=>setOpen(!open)} className="fixed bottom-4 left-4 bg-[#232F3E] text-white font-bold px-4 py-3 rounded-full shadow-lg z-50">{open?"Close":"Ask Cygna AI"}</button>
    {open&&<div className="fixed bottom-20 left-4 w-[90vw] max-w-sm bg-white border rounded-xl shadow-xl z-50 flex flex-col"><div className="p-3 h-72 overflow-y-auto space-y-2 text-sm">{msgs.map((m,i)=><div key={i} className={m.role==="user"?"text-right":""}><span className={`inline-block px-3 py-2 rounded-lg whitespace-pre-wrap ${m.role==="user"?"bg-[#232F3E] text-white":"bg-[#F5F5F5]"}`}>{m.content}</span></div>)}{busy&&<p className="text-xs">Thinking…</p>}</div>
      <form onSubmit={send} className="flex gap-2 p-2 border-t"><input value={t} onChange={e=>setT(e.target.value)} placeholder="Ask anything…" className="border rounded-lg px-3 py-2 flex-1"/><button className="btn-dark">Send</button></form></div>}</>);}
