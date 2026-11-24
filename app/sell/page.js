"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
const N="number",T="text";
const FIELDS={
 product:["products",[["title","Product name",T],["category","Category",T],["brand","Brand",T],["price","Price ₦",N],["stock","Stock",N]]],
 car:["cars",[["title","Car title (e.g. Toyota Camry 2015)",T],["make","Make",T],["year","Year",N],["mileage","Mileage (km)",N],["fuel","Fuel (Petrol/Diesel/Hybrid/Electric)",T],["transmission","Transmission",T],["area","Lagos area",T],["price","Price ₦",N]]],
 property:["properties",[["title","Property title",T],["listing_type","Buy / Rent / Short-let",T],["property_type","House / Flat / Duplex / Land / Commercial",T],["bedrooms","Bedrooms",N],["bathrooms","Bathrooms",N],["area","Lagos area",T],["price","Price ₦",N]]],
 gig:["gigs",[["title","Gig title",T],["category","Category",T],["price","Basic price ₦",N],["delivery_days","Delivery days",N]]]};
export default function Sell(){
  const [type,setType]=useState("product");const [v,setV]=useState({});const [pk,setPk]=useState({standard:"",premium:""});const [m,setM]=useState("");
  async function submit(e){e.preventDefault();setM("");
    const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const [table,fields]=FIELDS[type];const row={status:"pending"};row[type==="property"?"owner_id":"seller_id"]=user.id;
    fields.forEach(([k,,t])=>{row[k]=t===N?(+v[k]||0):(v[k]||"")});
    if(type==="gig")row.packages={basic:row.price,standard:+pk.standard||null,premium:+pk.premium||null};
    const f=e.target.photo.files[0];
    if(f){const path=`${user.id}/${Date.now()}-${f.name.replace(/[^\w.]/g,"_")}`;const up=await supabase.storage.from("listings").upload(path,f);
      if(up.error)return setM(up.error.message);row.image_url=supabase.storage.from("listings").getPublicUrl(path).data.publicUrl;}
    const {error}=await supabase.from(table).insert(row);
    if(error)return setM(error.message);setM("Submitted ✓ — it goes live after Cygna approves it.");setV({});}
  return(<main className="max-w-lg mx-auto px-4 py-6"><h1 className="text-2xl font-bold mb-3">Sell / List with Cygna</h1>
    <select value={type} onChange={e=>{setType(e.target.value);setV({})}} className="border rounded-lg px-3 py-2 w-full mb-3"><option value="product">Shop product</option><option value="car">Car</option><option value="property">Property</option><option value="gig">Service gig</option></select>
    <form onSubmit={submit} className="grid gap-2">{FIELDS[type][1].map(([k,l,t])=><input key={k} required={k==="title"||k==="price"} type={t} placeholder={l} value={v[k]||""} onChange={e=>setV({...v,[k]:e.target.value})} className="border rounded-lg px-3 py-2"/>)}
      {type==="gig"&&<div className="flex gap-2"><input type="number" placeholder="Standard price ₦" value={pk.standard} onChange={e=>setPk({...pk,standard:e.target.value})} className="border rounded-lg px-3 py-2 w-full"/><input type="number" placeholder="Premium price ₦" value={pk.premium} onChange={e=>setPk({...pk,premium:e.target.value})} className="border rounded-lg px-3 py-2 w-full"/></div>}
      <input name="photo" type="file" accept="image/*"/><button className="btn-dark">Submit for approval</button></form>
    {m&&<p className="text-sm mt-3">{m}</p>}</main>);}
