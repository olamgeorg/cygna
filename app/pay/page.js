"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PAY_DEFAULT, WHATSAPP } from "@/lib/config";
export default function Pay(){
  const [p,setP]=useState(PAY_DEFAULT);const [amt,setAmt]=useState("");const [ok,setOk]=useState("");
  useEffect(()=>{supabase.from("site_settings").select("*").then(({data})=>{if(data?.length){const o={...PAY_DEFAULT};data.forEach(r=>o[r.key]=r.value);setP(o);}});},[]);
  const msg=encodeURIComponent(`Hello Cygna, I have paid ₦${amt||"____"} to ${p.bank} ${p.account_number} (${p.account_name}). Receipt attached.`);
  return(<main className="max-w-md mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-3">Pay by bank transfer</h1>
    <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-1"><p>Bank: <b>{p.bank}</b></p><p>Account number: <b>{p.account_number}</b></p><p>Account name: <b>{p.account_name}</b></p>
      <button className="btn-dark mt-2" onClick={()=>navigator.clipboard.writeText(p.account_number).then(()=>setOk("Account number copied ✓"))}>Copy account number</button>{ok&&<p className="text-sm">{ok}</p>}</div>
    <p className="text-sm mt-3">Only pay to the account name shown above. After paying, send your receipt on WhatsApp so we can confirm your order. Card payments (Paystack / Flutterwave) are coming soon.</p>
    <input type="number" placeholder="Amount paid ₦" value={amt} onChange={e=>setAmt(e.target.value)} className="border rounded-lg px-3 py-2 w-full mt-3"/>
    <a className="btn-dark w-full text-center mt-3" target="_blank" href={`https://wa.me/${WHATSAPP}?text=${msg}`}>I have paid — send receipt</a>
    <p className="text-sm mt-3">Questions? Call {p.phone}</p></main>);}
