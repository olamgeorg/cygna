"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Vouchers(){
  const [l,setL]=useState([]);useEffect(()=>{supabase.from("coupons").select("*").eq("active",true).then(({data})=>setL(data||[]));},[]);
  return(<main className="max-w-xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Vouchers</h1>
    {l.map(c=><div key={c.id} className="border-2 border-dashed border-[#FF9900] rounded-lg p-4 mb-2 flex justify-between"><b>{c.code}</b><span>{c.percent}% off — apply in your cart</span></div>)}
    {!l.length&&<p>No vouchers right now. Check back soon.</p>}</main>);}
