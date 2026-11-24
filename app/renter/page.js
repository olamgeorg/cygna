"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Renter(){
  const [v,setV]=useState({occupation:"",monthly_income:"",household:"",about:""});const [uid,setUid]=useState(null);const [m,setM]=useState("");
  useEffect(()=>{supabase.auth.getUser().then(async({data})=>{if(!data.user){window.location.href="/auth";return}setUid(data.user.id);
    const r=(await supabase.from("renter_profiles").select("*").eq("user_id",data.user.id).maybeSingle()).data;if(r)setV({occupation:r.occupation||"",monthly_income:r.monthly_income||"",household:r.household||"",about:r.about||""});});},[]);
  async function save(e){e.preventDefault();const {error}=await supabase.from("renter_profiles").upsert({user_id:uid,occupation:v.occupation,monthly_income:+v.monthly_income||null,household:v.household,about:v.about});setM(error?error.message:"Saved ✓ Landlords you book tours with can view this.");}
  const inp="border rounded-lg px-3 py-2 w-full";
  return(<main className="max-w-md mx-auto px-4 py-6 sec-estate"><h1 className="text-2xl font-bold mb-3">Renter profile</h1>
    <form onSubmit={save} className="grid gap-2"><input placeholder="Occupation" value={v.occupation} onChange={e=>setV({...v,occupation:e.target.value})} className={inp}/><input type="number" placeholder="Monthly income ₦" value={v.monthly_income} onChange={e=>setV({...v,monthly_income:e.target.value})} className={inp}/>
      <input placeholder="Household (e.g. 2 adults, 1 child)" value={v.household} onChange={e=>setV({...v,household:e.target.value})} className={inp}/><textarea placeholder="About you" value={v.about} onChange={e=>setV({...v,about:e.target.value})} className={inp}/><button className="btn">Save profile</button></form>{m&&<p className="text-sm mt-3">{m}</p>}</main>);}
