"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const TBL={product:"products",car:"cars",property:"properties",gig:"gigs"};
export default function Related({type,row}){
  const [list,setList]=useState([]);
  useEffect(()=>{try{const v=JSON.parse(localStorage.getItem("cygna_viewed")||"[]").filter(x=>x.id!==row.id);v.unshift({t:type,id:row.id,title:row.title,price:row.price});localStorage.setItem("cygna_viewed",JSON.stringify(v.slice(0,8)));}catch{}
    supabase.from(TBL[type]).select("*").eq("status","approved").neq("id",row.id).limit(20).then(({data})=>{const d=data||[];const k=row.category||row.area;setList([...d.filter(x=>(x.category||x.area)===k),...d.filter(x=>(x.category||x.area)!==k)].slice(0,6));});},[row.id]);
  if(!list.length)return null;
  return(<section className="mt-6"><h2 className="font-semibold mb-2">{type==="product"?"Customers also viewed":"You may also like"}</h2>
    <div className="flex gap-3 overflow-x-auto">{list.map(x=><a key={x.id} href={`/item/${type}/${x.id}`} className="bg-[#F5F5F5] rounded-lg p-3 min-w-[160px]"><div className="h-20 bg-[#EEEEEE] rounded mb-2"/><p className="text-sm line-clamp-2 h-10">{x.title}</p><p className="font-bold text-sm">{naira(x.price)}</p></a>)}</div></section>);}
