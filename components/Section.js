"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira, WHATSAPP } from "@/lib/config";
import { addCart, toggleCmp, getCmp } from "@/lib/store";
const MAXC={car:4,property:5};
export default function Section({table,type,title,cls,meta}){
  const [rows,setRows]=useState([]);const [q,setQ]=useState("");const [msg,setMsg]=useState("");const [loading,setLoading]=useState(true);
  const [sort,setSort]=useState("new");const [max,setMax]=useState("");const [area,setArea]=useState("");const [cmp,setCmp]=useState([]);
  useEffect(()=>{setCmp(getCmp(type));supabase.from(table).select("*").eq("status","approved").order("created_at",{ascending:false}).then(({data})=>{setRows(data||[]);setLoading(false);});},[table]);
  async function save(id){const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const {error}=await supabase.from("saved_items").insert({user_id:user.id,item_type:type,item_id:id});setMsg(error?(error.code==="23505"?"Already saved":error.message):"Saved ✓");}
  async function saveSearch(){const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const {error}=await supabase.from("saved_searches").insert({user_id:user.id,item_type:type,query:q});setMsg(error?error.message:"We will notify you of new matches ✓");}
  function compare(id){if(!toggleCmp(type,id,MAXC[type]))setMsg(`You can compare up to ${MAXC[type]}.`);setCmp(getCmp(type));}
  const areas=[...new Set(rows.map(r=>r.area).filter(Boolean))];
  let shown=rows.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())&&(!max||r.price<=+max)&&(!area||r.area===area));
  if(sort==="lo")shown=[...shown].sort((a,b)=>a.price-b.price);if(sort==="hi")shown=[...shown].sort((a,b)=>b.price-a.price);
  shown=[...shown].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
  const eff=(r)=>r.deal_price&&new Date(r.deal_ends)>new Date()?r.deal_price:r.price;
  const badge=(r)=>{if(type!=="car")return null;const s=rows.filter(x=>x.make===r.make&&x.id!==r.id);if(!s.length)return null;const a=s.reduce((t,x)=>t+Number(x.price),0)/s.length,k=r.price/a;
    const [l,c]=k<=0.9?["Great Price","#1a7f37;color:#fff"]:k<=1?["Good Price","#2e7d32;color:#fff"]:k<=1.1?["Fair Price","#FF6B00;color:#000"]:["Above Average","#C62828;color:#fff"];
    return <span style={{background:c.split(";")[0],color:c.split("color:")[1]}} className="text-xs font-bold px-2 py-1 rounded ml-2">{l}</span>};
  const inp="border border-[#DADBDD] rounded-lg px-3 py-2";
  return(<main className={cls}><div className="max-w-6xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <div className={`flex flex-wrap gap-2 mb-2 ${type==="car"?"filterbar bg-[#003399] p-3 rounded-xl":type==="property"?"bg-[#E0F2FF] p-3 rounded-xl":""}`}><input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title}...`} className={inp+" flex-1 min-w-[180px]"}/>
      <input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="Max price ₦" className={inp+" w-36"}/>
      {areas.length>0&&<select value={area} onChange={e=>setArea(e.target.value)} className={inp}><option value="">All areas</option>{areas.map(a=><option key={a}>{a}</option>)}</select>}
      <select value={sort} onChange={e=>setSort(e.target.value)} className={inp}><option value="new">Newest</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select>
      {q&&<button className="btn-dark" onClick={saveSearch}>Alert me</button>}
      {MAXC[type]&&cmp.length>1&&<a className="btn" href={`/compare?type=${type}`}>Compare ({cmp.length})</a>}</div>
    {msg&&<p className="text-sm my-2">{msg}</p>}
    {loading?<p>Loading…</p>:<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {shown.map(r=>(<div key={r.id} className="bg-[#F5F5F5] rounded-xl p-4">
        <div className="h-32 bg-[#EEEEEE] rounded-lg mb-3 flex items-center justify-center text-sm text-gray-500">{r.image_url?<img src={r.image_url} alt={r.title} loading="lazy" className="h-32 w-full object-cover rounded-lg"/>:"No photo"}</div>
        <a href={`/item/${type}/${r.id}`}><h2 className="font-semibold underline">{r.title}</h2></a>
        <p className="text-sm text-gray-600">{meta(r)}</p>
        {type==="property"&&(()=>{const a=r.availability||"Available";return <span style={{background:a==="Available"?"#87BC43":a==="Pending"?"#F2A619":"#555",color:a==="Available"||a==="Pending"?"#000":"#fff"}} className="text-xs font-bold px-2 py-1 rounded">{a}</span>})()}{type==="gig"&&<span className="pill">{r.category}</span>}<p className="font-bold text-lg my-1">{eff(r)<r.price&&<s className="text-sm font-normal text-gray-500 mr-2">{naira(r.price)}</s>}{naira(eff(r))}{eff(r)<r.price&&<span className="text-xs font-bold bg-[#C62828] text-white px-2 py-1 rounded ml-2">DEAL</span>}{badge(r)}{r.featured&&<span style={{background:"#F2A619",color:"#000"}} className="text-xs font-bold px-2 py-1 rounded ml-2">Featured</span>}</p>
        <div className="flex flex-wrap gap-2 mt-2"><button className="btn" onClick={()=>save(r.id)}>Save</button>
          {type==="product"&&<button className="btn-dark" onClick={()=>{addCart({...r,price:eff(r)});setMsg("Added to cart ✓")}}>Add to cart</button>}
          {MAXC[type]&&<button className="border rounded-lg px-3 py-2 text-sm" onClick={()=>compare(r.id)}>{cmp.includes(r.id)?"Remove compare":"Compare"}</button>}
          <a className="btn-dark" target="_blank" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Cygna, I'm interested in: "+r.title)}`}>WhatsApp</a></div>
      </div>))}{!shown.length&&<p>No listings found.</p>}</div>}
  </div></main>);}
