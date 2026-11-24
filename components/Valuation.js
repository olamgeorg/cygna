"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
export default function Valuation(){
  const [make,setMake]=useState("");const [year,setYear]=useState(2015);const [out,setOut]=useState("");
  async function go(){const {data}=await supabase.from("cars").select("price,year").eq("status","approved").ilike("make",make.trim());
    const s=(data||[]).filter(c=>Math.abs(c.year-year)<=3);if(!s.length)return setOut("Not enough similar cars yet. Ask Cygna on WhatsApp for a manual valuation.");
    const a=s.reduce((t,c)=>t+Number(c.price),0)/s.length;setOut(`Estimated value: ${naira(Math.round(a*0.9))} – ${naira(Math.round(a*1.1))} (${s.length} similar car${s.length>1?"s":""} in Lagos)`);}
  return(<section className="sec-cars bg-[#F5F5F5] rounded-xl p-4 space-y-2 md:col-span-2"><h2 className="text-xl font-bold">What is my car worth?</h2>
    <div className="flex flex-wrap gap-2"><input placeholder="Make e.g. Toyota" value={make} onChange={e=>setMake(e.target.value)} className="border rounded-lg px-3 py-2"/><input type="number" value={year} onChange={e=>setYear(+e.target.value)} className="border rounded-lg px-3 py-2 w-28"/><button className="btn" onClick={go}>Get estimate</button></div>
    {out&&<p className="text-sm font-semibold">{out}</p>}</section>);}
