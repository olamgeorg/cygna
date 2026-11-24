"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Reviews({type,id,user}){
  const [list,setList]=useState([]);const [rating,setR]=useState(5);const [body,setB]=useState("");const [m,setM]=useState("");
  useEffect(()=>{supabase.from("reviews").select("*").eq("item_type",type).eq("item_id",id).eq("status","approved").then(({data})=>setList(data||[]));},[type,id]);
  async function submit(){if(!user){window.location.href="/auth";return}
    const {error}=await supabase.from("reviews").insert({user_id:user.id,item_type:type,item_id:id,rating,body});
    setM(error?error.message:"Thanks! Your review awaits approval.");setB("");}
  return(<div className="bg-[#F5F5F5] rounded-xl p-4 mt-4"><h2 className="font-semibold mb-2">Reviews ({list.length})</h2>
    {list.map(r=><p key={r.id} className="text-sm mb-1">{"★".repeat(r.rating)} {r.body}</p>)}
    <div className="flex gap-2 mt-2"><select value={rating} onChange={e=>setR(+e.target.value)} className="border rounded-lg px-2">{[5,4,3,2,1].map(n=><option key={n}>{n}</option>)}</select>
    <input value={body} onChange={e=>setB(e.target.value)} placeholder="Write a review" className="border rounded-lg px-3 py-2 flex-1"/><button className="btn-dark" onClick={submit}>Post</button></div>
    {m&&<p className="text-sm mt-2">{m}</p>}</div>);}
