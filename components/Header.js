"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Header(){
  const [user,setUser]=useState(null);
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user));
    const {data:s}=supabase.auth.onAuthStateChange((_e,ses)=>setUser(ses?.user||null));return()=>s.subscription.unsubscribe();},[]);
  const L=[["Shop","/shop"],["Cars","/cars"],["Real Estate","/real-estate"],["Services","/services"],["Search","/search"],["Messages","/messages"],["Sell","/sell"],["Jobs","/jobs"],["Tools","/tools"],["Cart","/cart"],["Verify ID","/verify"]];
  return(<header className="bg-brand text-white"><div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
    <Link href="/" className="text-xl font-bold">Cygna <span className="font-normal">Consult</span></Link>
    <nav className="flex gap-4 text-sm flex-1">{L.map(([n,h])=><Link key={h} href={h}>{n}</Link>)}</nav>
    {user?<a href="/dashboard" className="text-sm">Dashboard</a>:null}{user?<button onClick={()=>supabase.auth.signOut()} className="text-sm underline">Sign out</button>:<Link href="/auth" className="text-sm underline">Sign in</Link>}
  </div></header>);}
