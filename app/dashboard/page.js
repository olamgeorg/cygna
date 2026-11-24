"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
export default function Dashboard(){
  const [d,setD]=useState(null);const [prof,setProf]=useState({full_name:"",phone:"",location:""});const [note,setNote]=useState("");const [uid,setUid]=useState(null);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}setUid(user.id);
    const q=async(t,o="created_at")=>(await supabase.from(t).select("*").order(o,{ascending:false})).data||[];
    const p=(await supabase.from("profiles").select("*").eq("id",user.id).single()).data;if(p)setProf({full_name:p.full_name||"",phone:p.phone||"",location:p.location||""});
    setD({orders:await q("orders"),bookings:await q("bookings"),saved:await q("saved_items"),messages:await q("messages"),notes:await q("notifications")});})();},[]);
  async function saveProf(e){e.preventDefault();const {error}=await supabase.from("profiles").update(prof).eq("id",uid);setNote(error?error.message:"Profile saved ✓");}
  if(!d)return <p className="p-6">Loading…</p>;
  const Box=({t,children})=><section className="bg-[#F5F5F5] rounded-xl p-4"><h2 className="font-semibold mb-2">{t}</h2>{children}</section>;
  return(<main className="max-w-4xl mx-auto px-4 py-6 grid gap-4"><h1 className="text-2xl font-bold">My Dashboard</h1><div className="flex gap-2 flex-wrap"><a className="btn-dark" href="/offer">Instant car offer</a><a className="btn-dark" href="/contracts">Contracts</a><a className="btn-dark" href="/renter">Renter profile</a></div>
    <Box t="Profile"><form onSubmit={saveProf} className="grid gap-2">{["full_name","phone","location"].map(k=><input key={k} placeholder={k.replace("_"," ")} value={prof[k]} onChange={e=>setProf({...prof,[k]:e.target.value})} className="border rounded-lg px-3 py-2"/>)}<button className="btn-dark">Save profile</button>{note&&<p className="text-sm">{note}</p>}</form></Box>
    <Box t={`My Orders (${d.orders.length})`}><a className="btn mb-2" href="/pay">Pay / payment details</a>{d.orders.map(o=><p key={o.id} className="text-sm mb-1">{naira(o.total)} · {o.status.replace(/_/g," ")} · {o.payment_status==="paid"?"Paid":"Unpaid"} · {new Date(o.created_at).toLocaleDateString()} <button className="underline ml-2" onClick={async()=>{const {error}=await supabase.from("returns").insert({user_id:uid,order_id:o.id,reason:"Return requested"});setNote(error?error.message:"Return requested ✓")}}>Request return</button></p>)}</Box>
    <Box t={`My Tours / Inspections / Service Requests (${d.bookings.length})`}>{d.bookings.map(b=><p key={b.id} className="text-sm">{b.item_type} · {b.mode} · {b.scheduled_at?new Date(b.scheduled_at).toLocaleString():""} · {b.status}</p>)}</Box>
    <Box t={`My Saved Items (${d.saved.length})`}>{d.saved.map(s=><a key={s.id} className="text-sm underline block" href={`/item/${s.item_type}/${s.item_id}`}>{s.item_type}: view</a>)}</Box>
    <Box t={`Messages (${d.messages.length})`}>{d.messages.map(m=><p key={m.id} className="text-sm">{m.body}</p>)}</Box>
    <Box t={`Notifications (${d.notes.length})`}>{d.notes.map(n=><p key={n.id} className="text-sm">{n.title}: {n.body}</p>)}</Box>
  </main>);}
