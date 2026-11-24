"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Verify(){
  const [m,setM]=useState("");
  async function up(e){e.preventDefault();const f=e.target.file.files[0];if(!f)return;
    const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    const path=`${user.id}/${Date.now()}-${f.name.replace(/[^\w.]/g,"_")}`;
    const {error}=await supabase.storage.from("ids").upload(path,f);if(error)return setM(error.message);
    const r=await supabase.from("id_verifications").insert({user_id:user.id,file_path:path});setM(r.error?r.error.message:"ID submitted ✓ — Cygna will review it manually.");}
  return(<main className="max-w-sm mx-auto px-4 py-10"><h1 className="text-2xl font-bold mb-2">Verify your ID</h1>
    <p className="text-sm mb-4">Sellers and agents upload a government ID to earn a Verified badge. Files are private.</p>
    <form onSubmit={up} className="space-y-3"><input name="file" type="file" accept="image/*,.pdf" required/><button className="btn-dark w-full">Submit ID</button></form>{m&&<p className="text-sm mt-3">{m}</p>}</main>);}
