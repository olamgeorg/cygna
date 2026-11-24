"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Trust from "@/components/Trust";
import Extras from "@/components/Extras";
import Reviews from "@/components/Reviews";
import { naira, WHATSAPP, SITE } from "@/lib/config";
const MAP={product:["products","sec-shop","Place order (pay on delivery)"],car:["cars","sec-cars","Book test drive / inspection"],property:["properties","sec-estate","Book a tour"],gig:["gigs","sec-services","Request this service"]};
export default function Item(){
  const {type,id}=useParams();const cfg=MAP[type];
  const [row,setRow]=useState(null);const [user,setUser]=useState(null);const [msg,setMsg]=useState("");
  const [when,setWhen]=useState("");const [mode,setMode]=useState("in-person");const [text,setText]=useState("");
  useEffect(()=>{if(!cfg)return;supabase.from(cfg[0]).select("*").eq("id",id).single().then(({data})=>setRow(data));
    supabase.auth.getUser().then(({data})=>setUser(data.user));},[id]);
  if(!cfg)return <p className="p-6">Not found.</p>;
  if(!row)return <p className="p-6">Loading…</p>;
  const price=row.deal_price&&new Date(row.deal_ends)>new Date()?row.deal_price:row.price;
  const need=()=>{if(!user){window.location.href="/auth";return false}return true};
  const done=(error,ok)=>setMsg(error?error.message:ok);
  async function act(){if(!need())return;
    if(type==="product"){const {data:od,error}=await supabase.from("orders").insert({user_id:user.id,product_id:id,quantity:1,total:price}).select("id").single();
      if(!error)await supabase.from("escrow").insert({order_id:od.id,buyer_id:user.id,seller_id:row.seller_id,amount:price});
      if(!error)await supabase.from("notifications").insert({user_id:user.id,title:"Order placed",body:row.title});
      return done(error,"Order placed ✓ — see your dashboard.");}
    if(!when)return setMsg("Pick a date and time first.");
    const {error}=await supabase.from("bookings").insert({user_id:user.id,item_type:type,item_id:id,mode,scheduled_at:when});
    done(error,"Request sent ✓ — we will confirm.");}
  async function save(){if(!need())return;const {error}=await supabase.from("saved_items").insert({user_id:user.id,item_type:type,item_id:id});
    done(error&&error.code!=="23505"?error:null,"Saved ✓");}
  async function send(){if(!need()||!text.trim())return;const {error}=await supabase.from("messages").insert({sender_id:user.id,body:`[${row.title}] ${text}`});
    if(!error)setText("");done(error,"Message sent to Cygna ✓");}
  const link=`${SITE}/item/${type}/${id}`;const share=encodeURIComponent(`${row.title} - ${link}`);
  return(<main className={cfg[1]}><div className="max-w-3xl mx-auto px-4 py-6">
    <div className="h-56 bg-[#EEEEEE] rounded-xl mb-4 flex items-center justify-center text-gray-500">{row.image_url?<img src={row.image_url} alt={row.title} className="h-56 w-full object-cover rounded-xl"/>:"No photo"}</div>
    <h1 className="text-2xl font-bold">{row.title}</h1><p className="text-2xl font-bold my-2">{naira(row.price)}</p>
    <p className="text-sm text-gray-700 mb-4">{["category","brand","make","year","mileage","fuel","transmission","listing_type","property_type","bedrooms","bathrooms","area","delivery_days","stock"].filter(k=>row[k]!=null&&row[k]!=="").map(k=>`${k.replace("_"," ")}: ${row[k]}`).join(" · ")}</p>
    <div className="flex flex-wrap gap-2 mb-4"><button className="btn" onClick={save}>Save</button>
      <a className="btn-dark" target="_blank" href={`https://wa.me/${WHATSAPP}?text=${share}`}>WhatsApp</a>
      <a className="btn-dark" href={`tel:+${WHATSAPP}`}>Call</a>
      <a className="border rounded-lg px-3 py-2" target="_blank" href={`https://wa.me/?text=${share}`}>Share</a>
      <button className="border rounded-lg px-3 py-2" onClick={()=>navigator.clipboard.writeText(link).then(()=>setMsg("Link copied ✓"))}>Copy link</button></div>
    <div className="bg-[#F5F5F5] rounded-xl p-4 mb-4"><h2 className="font-semibold mb-2">{cfg[2]}</h2>
      {type!=="product"&&<div className="flex flex-wrap gap-2 mb-2"><input type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} className="border rounded-lg px-3 py-2"/>
        <select value={mode} onChange={e=>setMode(e.target.value)} className="border rounded-lg px-3 py-2"><option value="in-person">In person</option><option value="video">Video</option></select></div>}
      <button className="btn" onClick={act}>{cfg[2]}</button></div>
    <div className="bg-[#F5F5F5] rounded-xl p-4"><h2 className="font-semibold mb-2">Message Cygna about this listing</h2>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="border rounded-lg px-3 py-2 w-full" rows={3}/><button className="btn-dark mt-2" onClick={send}>Send</button></div>
    <Trust type={type} row={row} user={user}/>
    <Extras type={type} row={row}/>
    {row.tour_url&&<a className="btn mt-4" target="_blank" href={row.tour_url}>Watch video / 3D tour</a>}
    <Reviews type={type} id={id} user={user}/>
    {msg&&<p className="text-sm mt-3">{msg}</p>}
    <p className="text-xs text-gray-600 mt-4">Never pay outside Cygna. Phone numbers stay hidden; contact via WhatsApp or messages.</p>
  </div></main>);}
