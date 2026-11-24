"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Trust({type,row,user}){
  const [ver,setVer]=useState(false);const [rt,setRt]=useState(null);const [hist,setHist]=useState(null);const [qs,setQs]=useState([]);const [q,setQ]=useState("");const [m,setM]=useState("");
  const owner=row.seller_id||row.owner_id;
  const loadQ=()=>supabase.from("questions").select("*").eq("item_id",row.id).order("created_at").then(({data})=>setQs(data||[]));
  useEffect(()=>{if(owner)supabase.from("profiles").select("verified").eq("id",owner).single().then(({data})=>setVer(!!data?.verified));if(type==="product")loadQ();
    if(owner)supabase.from("reviews").select("rating").eq("item_type","seller").eq("item_id",owner).eq("status","approved").then(({data})=>{if(data?.length)setRt([data.reduce((a,x)=>a+x.rating,0)/data.length,data.length]);});
    if(type==="car")supabase.from("car_history").select("*").eq("car_id",row.id).maybeSingle().then(({data})=>setHist(data));},[row.id]);
  const need=()=>{if(!user){window.location.href="/auth";return false}return true};
  async function report(){if(!need())return;const reason=window.prompt("Why are you reporting this listing?");if(!reason)return;
    const {error}=await supabase.from("reports").insert({user_id:user.id,item_type:type,item_id:row.id,reason});setM(error?error.message:"Report sent. Thank you.");}
  async function ask(){if(!need()||!q.trim())return;const {error}=await supabase.from("questions").insert({user_id:user.id,item_id:row.id,question:q});if(!error){setQ("");loadQ();}else setM(error.message);}
  async function rate(){if(!need())return;const r=+window.prompt("Rate this seller 1-5");if(!(r>=1&&r<=5))return;const {error}=await supabase.from("reviews").insert({user_id:user.id,item_type:"seller",item_id:owner,rating:Math.round(r)});setM(error?error.message:"Thanks! Rating awaits approval.");}
  async function answer(id){const a=window.prompt("Your answer");if(!a)return;await supabase.from("questions").update({answer:a}).eq("id",id);loadQ();}
  return(<div className="mb-4">
    <div className="flex items-center gap-2 mb-3 text-sm">{ver?<span className="bg-[#1a7f37] text-white px-2 py-1 rounded font-bold">✓ Verified seller</span>:<span className="text-gray-600">Seller not yet verified</span>}{rt&&<span className="text-gray-700">★ {rt[0].toFixed(1)} ({rt[1]})</span>}{rt&&rt[0]>=4.5&&rt[1]>=3&&<span className="bg-[#003399] text-white px-2 py-1 rounded font-bold">Highly Rated</span>}<button className="underline ml-auto" onClick={rate}>Rate seller</button><button className="underline" onClick={report}>Report listing</button></div>
    {type==="car"&&<div className="bg-[#F5F5F5] rounded-xl p-4 mb-3 text-sm"><h2 className="font-semibold mb-1">History check</h2>{hist?<ul className="list-disc ml-5"><li>Accident history: {hist.accident||"—"}</li><li>Previous owners: {hist.owners??"—"}</li><li>Service records: {hist.service_records||"—"}</li><li>Inspection: {hist.inspection||"—"}</li></ul>:<p>Not yet uploaded. Ask Cygna on WhatsApp for the inspection report.</p>}</div>}
    {type==="property"&&row.area&&<iframe title="Map" loading="lazy" className="w-full h-56 rounded-xl mb-3" src={`https://www.google.com/maps?q=${encodeURIComponent(row.area+" Lagos Nigeria")}&output=embed`}/>}
    {type==="product"&&<div className="bg-[#F5F5F5] rounded-xl p-4"><h2 className="font-semibold mb-2">Questions &amp; answers</h2>
      {qs.map(x=><div key={x.id} className="text-sm mb-2"><b>Q:</b> {x.question}<br/>{x.answer?<><b>A:</b> {x.answer}</>:user?.id===owner?<button className="underline" onClick={()=>answer(x.id)}>Answer</button>:<i>Awaiting seller</i>}</div>)}
      <div className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask the seller a question" className="border rounded-lg px-3 py-2 flex-1"/><button className="btn-dark" onClick={ask}>Ask</button></div></div>}
    {m&&<p className="text-sm mt-2">{m}</p>}</div>);}
