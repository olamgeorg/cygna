"use client";
import { useState } from "react";
import Valuation from "@/components/Valuation";
import { naira } from "@/lib/config";
const pmt=(p,rate,n)=>{const r=rate/1200;return r?p*r/(1-Math.pow(1+r,-n)):p/n};
function Num({l,v,s}){return <label className="block text-sm">{l}<input type="number" value={v} onChange={e=>s(+e.target.value)} className="border rounded-lg px-3 py-2 w-full"/></label>}
export default function Tools(){
  const [cp,setCp]=useState(7000000),[cd,setCd]=useState(1500000),[ct,setCt]=useState(0),[cr,setCr]=useState(25),[cm,setCm]=useState(36),[ci,setCi]=useState(5);
  const [hp,setHp]=useState(60000000),[hd,setHd]=useState(12000000),[hr,setHr]=useState(22),[hy,setHy]=useState(15),[inc,setInc]=useState(1000000);
  const loan=Math.max(0,cp-cd-ct),carPay=pmt(loan,cr,cm),ins=cp*ci/100/12;
  const mort=pmt(Math.max(0,hp-hd),hr,hy*12),ok=mort<=inc*0.33;
  return(<main className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
    <section className="sec-cars bg-[#F5F5F5] rounded-xl p-4 space-y-2"><h2 className="text-xl font-bold">Car finance calculator</h2>
      <Num l="Car price ₦" v={cp} s={setCp}/><Num l="Down payment ₦" v={cd} s={setCd}/><Num l="Trade-in value ₦" v={ct} s={setCt}/><Num l="Interest rate % / year" v={cr} s={setCr}/><Num l="Months" v={cm} s={setCm}/><Num l="Insurance % of price / year" v={ci} s={setCi}/>
      <p className="font-bold">Monthly payment: {naira(Math.round(carPay))}</p><p className="text-sm">+ insurance estimate {naira(Math.round(ins))}/month</p></section>
    <section className="sec-estate bg-[#E0F2FF] rounded-xl p-4 space-y-2"><h2 className="text-xl font-bold">Mortgage &amp; BuyAbility</h2>
      <Num l="Home price ₦" v={hp} s={setHp}/><Num l="Down payment ₦" v={hd} s={setHd}/><Num l="Interest rate % / year" v={hr} s={setHr}/><Num l="Loan term (years)" v={hy} s={setHy}/><Num l="Monthly income ₦" v={inc} s={setInc}/>
      <p className="font-bold">Monthly payment: {naira(Math.round(mort))}</p>
      <p className="text-sm">BuyAbility: {ok?"✅ Within 33% of your income — looks affordable.":"⚠️ Above 33% of income — try a bigger down payment or longer term."}</p></section>
    <Valuation/>
    <p className="text-xs text-gray-600 md:col-span-2">Estimates only. Not financial advice.</p></main>);}
