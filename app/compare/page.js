"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
import { getCmp } from "@/lib/store";
const F={car:["price","year","mileage","fuel","transmission","area"],property:["price","listing_type","property_type","bedrooms","bathrooms","area"]};
export default function Compare(){
  const [rows,setRows]=useState([]);const [type,setType]=useState("car");
  useEffect(()=>{const t=new URLSearchParams(window.location.search).get("type")==="property"?"property":"car";setType(t);
    const ids=getCmp(t);if(ids.length)supabase.from(t==="car"?"cars":"properties").select("*").in("id",ids).then(({data})=>setRows(data||[]));},[]);
  return(<main className="max-w-5xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Compare {type==="car"?"cars":"homes"}</h1>
    <div className="overflow-x-auto"><table className="text-sm border-collapse w-full"><thead><tr><th className="p-2 text-left"></th>{rows.map(r=><th key={r.id} className="p-2 text-left border-b">{r.title}</th>)}</tr></thead>
    <tbody>{F[type].map(k=><tr key={k}><td className="p-2 font-semibold border-b">{k.replace("_"," ")}</td>{rows.map(r=><td key={r.id} className="p-2 border-b">{k==="price"?naira(r[k]):String(r[k]??"-")}</td>)}</tr>)}</tbody></table></div>
    {!rows.length&&<p>Nothing to compare yet. Tick Compare on listings first.</p>}</main>);}
