"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Auth(){
  const [mode,setMode]=useState("in");const [email,setE]=useState("");const [pw,setP]=useState("");const [name,setN]=useState("");const [msg,setM]=useState("");
  async function submit(e){e.preventDefault();setM("");
    const r=mode==="in"?await supabase.auth.signInWithPassword({email,password:pw}):await supabase.auth.signUp({email,password:pw,options:{data:{full_name:name}}});
    if(r.error)return setM(r.error.message);
    if(mode==="up"&&!r.data.session)return setM("Check your email to confirm your account.");
    window.location.href="/";}
  const google=()=>supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
  return(<main className="max-w-sm mx-auto px-4 py-10"><h1 className="text-2xl font-bold mb-4">{mode==="in"?"Sign in":"Create account"}</h1>
  <form onSubmit={submit} className="space-y-3">
  {mode==="up"&&<input required placeholder="Full name" value={name} onChange={e=>setN(e.target.value)} className="border rounded-lg px-3 py-2 w-full"/>}
  <input required type="email" placeholder="Email" value={email} onChange={e=>setE(e.target.value)} className="border rounded-lg px-3 py-2 w-full"/>
  <input required type="password" minLength={6} placeholder="Password" value={pw} onChange={e=>setP(e.target.value)} className="border rounded-lg px-3 py-2 w-full"/>
  <button className="btn-dark w-full">{mode==="in"?"Sign in":"Sign up"}</button></form>
  <button onClick={google} className="border rounded-lg px-3 py-2 w-full mt-3">Continue with Google</button>
  {msg&&<p className="text-sm mt-3 text-red-700">{msg}</p>}
  <button className="text-sm underline mt-4" onClick={()=>setMode(mode==="in"?"up":"in")}>{mode==="in"?"New here? Create account":"Have an account? Sign in"}</button></main>);}
