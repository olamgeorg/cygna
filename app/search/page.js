"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const AREAS=["Lekki","Ikeja","Yaba","Surulere","Ikorodu","Ajah"];
const TABLE={product:"products",car:"cars",property:"properties",gig:"gigs"};
function parse(s){const l=s.toLowerCase();let max=null;const m=l.match(/(\d+(?:\.\d+)?)\s*(million|thousand|m|k)\b/);if(m)max=parseFloat(m[1])*(/^m/.test(m[2])?1e6:1e3);
  const b=l.match(/(\d+)\s*bed/);const area=AREAS.find(a=>l.includes(a.toLowerCase()));let type="product";
  if(/flat|duplex|land|house|rent|bedroom|short-let/.test(l))type="property";else if(/\bcar\b|toyota|honda|lexus|mercedes|tesla|bus|suv|sedan/.test(l))type="car";else if(/design|logo|website|writing|video|marketing|freelance|gig/.test(l))type="gig";
  const tokens=l.replace(/\d+(\.\d+)?\s*(million|thousand|m|k)\b/g,"").replace(/\d+\s*bed\w*/g,"").split(/\s+/).filter(w=>w.length>2&&!["under","below","for","the","and","with"].includes(w)&&!AREAS.some(a=>a.toLowerCase()===w));
  return{max,beds:b?+b[1]:null,area,type,tokens};}
export default function Search(){
  const [q,setQ]=useState("");const [rows,setRows]=useState(null);const [info,setInfo]=useState("");
  async function go(e){e.preventDefault();const p=parse(q);let r=supabase.from(TABLE[p.type]).select("*").eq("status","approved");
    if(p.max)r=r.lte("price",p.max);if(p.beds&&p.type==="property")r=r.eq("bedrooms",p.beds);if(p.area&&(p.type==="car"||p.type==="property"))r=r.eq("area",p.area);
    let {data}=await r;data=data||[];if(p.type==="product"||p.type==="gig"){const t=p.tokens;if(t.length)data=data.filter(x=>t.some(w=>x.title.toLowerCase().includes(w)));}
    setInfo(`Searching ${p.type}s${p.area?" in "+p.area:""}${p.max?" under "+naira(p.max):""}${p.beds?" with "+p.beds+" bedrooms":""}`);setRows(data.map(x=>({...x,_t:p.type})));}
  return(<main className="max-w-4xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-2">Smart search</h1>
    <form onSubmit={go} className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder='Try: "3 bedroom flat in Lekki under 5m"' className="border rounded-lg px-3 py-2 flex-1"/><button type="button" className="border rounded-lg px-3" onClick={()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert("Voice search is not supported on this browser.");const r=new R();r.lang="en-NG";r.onresult=e=>setQ(e.results[0][0].transcript);r.start();}}>🎤</button><button className="btn-dark">Search</button></form>
    {info&&<p className="text-sm mt-3">{info}</p>}
    <div className="grid sm:grid-cols-2 gap-3 mt-3">{rows?.map(r=><a key={r.id} href={`/item/${r._t}/${r.id}`} className="bg-[#F5F5F5] rounded-xl p-4 block"><b>{r.title}</b><p>{naira(r.price)}</p></a>)}{rows&&!rows.length&&<p>No matches.</p>}</div></main>);}
