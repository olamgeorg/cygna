"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const TBL={product:"products",car:"cars",property:"properties",gig:"gigs"};
export default function Saved(){
  const [items,setItems]=useState(null);
  async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const {data:s}=await supabase.from("saved_items").select("*").order("created_at",{ascending:false});const out=[];
    for(const x of s||[]){const r=(await supabase.from(TBL[x.item_type]).select("title,price").eq("id",x.item_id).maybeSingle()).data;if(r)out.push({...x,...r});}setItems(out);}
  useEffect(()=>{load()},[]);
  if(!items)return <p className="p-6">Loading…</p>;
  return(<main className="max-w-3xl mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Saved items</h1>
    {items.map(x=><div key={x.id} className="bg-[#F5F5F5] rounded-lg p-3 mb-2 flex justify-between items-center"><a className="underline" href={`/item/${x.item_type}/${x.item_id}`}>{x.title} — {naira(x.price)}</a>
      <button className="text-sm underline" onClick={async()=>{await supabase.from("saved_items").delete().eq("id",x.id);load()}}>Remove</button></div>)}
    {!items.length&&<p>Nothing saved yet.</p>}</main>);}
