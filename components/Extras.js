"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const HOOD={Lekki:"Markets, private schools and clinics nearby. Expect heavy Lekki–Epe Expressway traffic at peak hours.",Ikeja:"Close to the airport, Ikeja City Mall and Computer Village. Good road links.",Yaba:"Universities and the tech hub area. Access to Third Mainland Bridge.",Surulere:"Dense residential area with markets, the National Stadium and a mall.",Ikorodu:"More affordable. Longer commute to the Island; BRT and ferry options.",Ajah:"Fast-growing along Lekki–Epe. Check flooding and drainage on inspection."};
export default function Extras({type,row}){
  const [est,setEst]=useState(null);
  useEffect(()=>{if(type!=="property")return;supabase.from("properties").select("price,bedrooms").eq("status","approved").eq("listing_type",row.listing_type).eq("area",row.area).neq("id",row.id)
    .then(({data})=>{const s=(data||[]).filter(x=>Math.abs((x.bedrooms||0)-(row.bedrooms||0))<=1);if(s.length){const a=s.reduce((t,x)=>t+Number(x.price),0)/s.length;setEst([a*0.88,a*1.12,s.length]);}});},[row.id]);
  if(type==="property")return(<div className="bg-[#E0F2FF] rounded-xl p-4 mb-4 text-sm"><h2 className="font-semibold mb-1">Cygna Value Estimate</h2>
    <p>{est?`${naira(Math.round(est[0]))} – ${naira(Math.round(est[1]))} (based on ${est[2]} similar listing${est[2]>1?"s":""})`:"Not enough similar listings yet."}</p>
    <h2 className="font-semibold mt-3 mb-1">Neighbourhood notes</h2><p>{HOOD[row.area]||"Ask Cygna about this area."} <span className="text-gray-600">General guidance; verify on inspection.</span></p></div>);
  if(type==="gig"&&row.packages)return(<div className="grid grid-cols-3 gap-2 mb-4 text-sm">{["basic","standard","premium"].map(k=><div key={k} className="bg-[#F5F5F5] rounded-xl p-3"><b className="capitalize">{k}</b><p>{row.packages[k]?naira(row.packages[k]):"—"}</p></div>)}</div>);
  return null;}
