"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
export default function Offer(){
  const [v,setV]=useState({make:"",year:"",mileage:"",condition:""});const [list,setList]=useState([]);const [m,setM]=useState("");const [uid,setUid]=useState(null);
  const load=()=>supabase.from("offers").select("*").order("created_at",{ascending:false}).then(({data})=>setList(data||[]));
  useEffect(()=>{supabase.auth.getUser().then(({data})=>{if(!data.user){window.location.href="/auth";return}setUid(data.user.id);load();});},[]);
  async function go(e){e.preventDefault();const {error}=await supabase.from("offers").insert({user_id:uid,make:v.make,year:+v.year||null,mileage:+v.mileage||null,condition:v.condition});
    setM(error?error.message:"Request sent ✓ — a Cygna dealer will respond with an offer.");if(!error)load();}
  const inp="border rounded-lg px-3 py-2 w-full";
  return(<main className="max-w-md mx-auto px-4 py-6 sec-cars"><h1 className="text-2xl font-bold mb-3">Instant offer for your car</h1>
    <form onSubmit={go} className="grid gap-2"><input required placeholder="Make & model" value={v.make} onChange={e=>setV({...v,make:e.target.value})} className={inp}/>
      <input type="number" placeholder="Year" value={v.year} onChange={e=>setV({...v,year:e.target.value})} className={inp}/><input type="number" placeholder="Mileage (km)" value={v.mileage} onChange={e=>setV({...v,mileage:e.target.value})} className={inp}/>
      <textarea placeholder="Condition, accidents, extras" value={v.condition} onChange={e=>setV({...v,condition:e.target.value})} className={inp}/><button className="btn-dark">Request offer</button></form>
    {m&&<p className="text-sm mt-3">{m}</p>}<h2 className="font-semibold mt-5 mb-2">My requests</h2>
    {list.map(o=><p key={o.id} className="text-sm bg-[#F5F5F5] rounded p-2 mb-1">{o.make} {o.year} — {o.offer_amount?`Offer: ${naira(o.offer_amount)}`:"Awaiting offer"}</p>)}</main>);}
