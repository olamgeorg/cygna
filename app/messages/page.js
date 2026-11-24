"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Messages(){
  const [uid,setUid]=useState(null);const [list,setList]=useState([]);const [text,setText]=useState("");
  async function load(){const {data}=await supabase.from("messages").select("*").order("created_at");setList(data||[]);}
  useEffect(()=>{supabase.auth.getUser().then(({data})=>{if(!data.user){window.location.href="/auth";return}setUid(data.user.id);load();});
    const t=setInterval(load,5000);return()=>clearInterval(t);},[]);
  async function send(e){e.preventDefault();if(!text.trim())return;await supabase.from("messages").insert({sender_id:uid,body:text});setText("");load();}
  return(<main className="max-w-xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Messages</h1>
    <div className="bg-[#F5F5F5] rounded-xl p-3 h-80 overflow-y-auto space-y-2">{list.map(m=><div key={m.id} className={m.sender_id===uid?"text-right":""}><span className={`inline-block px-3 py-1 rounded-lg text-sm ${m.sender_id===uid?"bg-[#232F3E] text-white":"bg-white"}`}>{m.body}</span></div>)}{!list.length&&<p className="text-sm">No messages yet. Chat with Cygna support below.</p>}</div>
    <form onSubmit={send} className="flex gap-2 mt-3"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="border rounded-lg px-3 py-2 flex-1"/><button className="btn-dark">Send</button></form>
    <p className="text-xs text-gray-600 mt-3">Keep all chats on Cygna. Never pay outside Cygna.</p></main>);}
