"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
const FAQ=[["How do I pay?","Choose pay on delivery at checkout, or send a bank transfer using the details on the Pay page, then WhatsApp your receipt."],["How do I track my order?","Open your Dashboard. Each order shows Ordered, Shipped, Out for delivery and Delivered."],["How do I return an item?","In your Dashboard, tap Request return next to the order. We will review it and update the status."],["How do I sell on Cygna?","Open Sell / List in the menu, fill the form and submit. Listings go live after approval."],["Is my money safe?","Only pay to the account name shown on the Pay page. Never pay anyone outside Cygna."]];
export default function Help(){
  const [t,setT]=useState("");const [m,setM]=useState("");
  async function send(e){e.preventDefault();const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const {error}=await supabase.from("messages").insert({sender_id:user.id,body:`[DISPUTE / SUPPORT] ${t}`});setM(error?error.message:"Sent ✓ Our team will respond in Messages.");if(!error)setT("");}
  return(<main className="max-w-2xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Help Center</h1>
    {FAQ.map(([q,a])=><details key={q} className="bg-[#F5F5F5] rounded-lg p-3 mb-2"><summary className="font-semibold cursor-pointer">{q}</summary><p className="text-sm mt-2">{a}</p></details>)}
    <h2 className="font-semibold mt-5 mb-2">Contact support or open a dispute</h2>
    <form onSubmit={send} className="grid gap-2"><textarea required value={t} onChange={e=>setT(e.target.value)} placeholder="Describe your issue and order details" className="border rounded-lg px-3 py-2"/><button className="btn-dark">Send to Cygna</button></form>{m&&<p className="text-sm mt-2">{m}</p>}
    <p className="text-sm mt-4">Or call / WhatsApp <b>09134088925</b>.</p></main>);}
