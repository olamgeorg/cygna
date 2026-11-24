"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const T=["products","cars","properties","gigs"];
const cnt=async(t)=>(await supabase.from(t).select("id",{count:"exact",head:true})).count||0;
export default function Admin(){
  const [ok,setOk]=useState(null);const [pending,setPending]=useState([]);const [stats,setStats]=useState({});
  const [rev,setRev]=useState([]);const [ord,setOrd]=useState([]);const [rep,setRep]=useState([]);const [ret,setRet]=useState([]);const [cps,setCps]=useState([]);const [st,setSt]=useState({});const [cc,setCc]=useState({code:"",percent:""});const [off,setOff]=useState([]);const [lm,setLm]=useState([]);const [lst,setLst]=useState({cars:[],products:[]});const [hf,setHf]=useState({car_id:"",accident:"",owners:"",service:"",inspection:""});const [dl,setDl]=useState({pid:"",price:"",hours:"24"});const [usr,setUsr]=useState([]);const [ids,setIds]=useState([]);const [esc,setEsc]=useState([]);
  async function load(){const p=[];const s={};
    for(const t of ["profiles","orders","bookings","messages",...T])s[t]=await cnt(t);
    for(const t of T){const {data}=await supabase.from(t).select("id,title").eq("status","pending");(data||[]).forEach(r=>p.push({...r,t}));}
    s.revenue=((await supabase.from("orders").select("total")).data||[]).reduce((a,o)=>a+Number(o.total||0),0);
    setStats(s);setPending(p);
    setRev((await supabase.from("reviews").select("*").eq("status","pending")).data||[]);
    setIds((await supabase.from("id_verifications").select("*").eq("status","pending")).data||[]);
    setEsc((await supabase.from("escrow").select("*").eq("status","held")).data||[]);
    setOrd((await supabase.from("orders").select("*").order("created_at",{ascending:false}).limit(20)).data||[]);
    setUsr((await supabase.from("profiles").select("*").order("created_at",{ascending:false}).limit(20)).data||[]);
    setRep((await supabase.from("reports").select("*").eq("status","open")).data||[]);
    setRet((await supabase.from("returns").select("*").order("created_at",{ascending:false})).data||[]);
    setCps((await supabase.from("coupons").select("*")).data||[]);
    const o={};((await supabase.from("site_settings").select("*")).data||[]).forEach(r=>o[r.key]=r.value);setSt(o);
    {const L=[];for(const t of T){((await supabase.from(t).select("*").eq("status","approved").limit(15)).data||[]).forEach(r=>L.push({...r,t}));}setLm(L);}
    setOff((await supabase.from("offers").select("*").eq("status","requested")).data||[]);
    setLst({cars:(await supabase.from("cars").select("id,title")).data||[],products:(await supabase.from("products").select("id,title")).data||[]});}
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return setOk(false);
    const {data}=await supabase.from("profiles").select("role").eq("id",user.id).single();
    if(data?.role==="admin"){setOk(true);load();}else setOk(false);})();},[]);
  const run=async(p)=>{await p;load();};
  if(ok===null)return <p className="p-6">Loading…</p>;
  if(!ok)return <p className="p-6">Access denied. Admins only.</p>;
  const Row=({text,children})=><div className="bg-[#F5F5F5] p-3 rounded-lg flex justify-between items-center gap-2 text-sm"><span>{text}</span><span className="flex gap-2">{children}</span></div>;
  const B=({onClick,children})=><button className="btn-dark" onClick={onClick}>{children}</button>;
  return(<main className="max-w-4xl mx-auto px-4 py-6 space-y-3"><h1 className="text-2xl font-bold">Admin</h1>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">{Object.entries(stats).map(([k,v])=><div key={k} className="bg-[#F5F5F5] rounded-lg p-3"><b>{k==="revenue"?naira(v):v}</b><br/>{k}</div>)}</div>
    <h2 className="font-semibold">Pending listings</h2>{pending.map(r=><Row key={r.t+r.id} text={`${r.t}: ${r.title}`}><B onClick={()=>run(supabase.from(r.t).update({status:"approved"}).eq("id",r.id))}>Approve</B><B onClick={()=>run(supabase.from(r.t).update({status:"rejected"}).eq("id",r.id))}>Reject</B></Row>)}
    <h2 className="font-semibold">Pending reviews</h2>{rev.map(r=><Row key={r.id} text={`${r.rating}★ ${r.body}`}><B onClick={()=>run(supabase.from("reviews").update({status:"approved"}).eq("id",r.id))}>Approve</B><B onClick={()=>run(supabase.from("reviews").update({status:"hidden"}).eq("id",r.id))}>Hide</B></Row>)}
    <h2 className="font-semibold">ID verifications</h2>{ids.map(r=><Row key={r.id} text={r.file_path}><B onClick={async()=>{const {data}=await supabase.storage.from("ids").createSignedUrl(r.file_path,300);if(data)window.open(data.signedUrl)}}>View</B><B onClick={async()=>{await supabase.from("profiles").update({verified:true}).eq("id",r.user_id);run(supabase.from("id_verifications").update({status:"approved"}).eq("id",r.id))}}>Verify</B><B onClick={()=>run(supabase.from("id_verifications").update({status:"rejected"}).eq("id",r.id))}>Reject</B></Row>)}
    <h2 className="font-semibold">Escrow (held funds)</h2>{esc.map(r=><Row key={r.id} text={naira(r.amount)}><B onClick={()=>run(supabase.from("escrow").update({status:"released"}).eq("id",r.id))}>Release</B><B onClick={()=>run(supabase.from("escrow").update({status:"refunded"}).eq("id",r.id))}>Refund</B></Row>)}
    <h2 className="font-semibold">Orders</h2>{ord.map(o=><Row key={o.id} text={`${naira(o.total)} · ${new Date(o.created_at).toLocaleDateString()}`}><select value={o.status} onChange={e=>run(supabase.from("orders").update({status:e.target.value}).eq("id",o.id))} className="border rounded px-2">{["ordered","shipped","out_for_delivery","delivered","cancelled"].map(s=><option key={s}>{s}</option>)}</select><B onClick={()=>run(supabase.from("orders").update({payment_status:"paid"}).eq("id",o.id))}>{o.payment_status==="paid"?"Paid ✓":"Mark paid"}</B></Row>)}
    <h2 className="font-semibold">Users</h2>{usr.map(u=><Row key={u.id} text={`${u.full_name||u.id.slice(0,8)}${u.verified?" ✓":""}${u.blocked?" (blocked)":""}`}><select value={u.role} onChange={e=>run(supabase.from("profiles").update({role:e.target.value}).eq("id",u.id))} className="border rounded px-2">{["user","seller","agent","admin"].map(s=><option key={s}>{s}</option>)}</select><B onClick={()=>run(supabase.from("profiles").update({blocked:!u.blocked}).eq("id",u.id))}>{u.blocked?"Unblock":"Block"}</B></Row>)}
    <h2 className="font-semibold">Reports</h2>{rep.map(r=><Row key={r.id} text={`${r.item_type}: ${r.reason}`}><B onClick={()=>run(supabase.from("reports").update({status:"closed"}).eq("id",r.id))}>Close</B></Row>)}
    <h2 className="font-semibold">Returns</h2>{ret.map(r=><Row key={r.id} text={r.reason}><select value={r.status} onChange={e=>run(supabase.from("returns").update({status:e.target.value}).eq("id",r.id))} className="border rounded px-2">{["requested","approved","refunded","rejected"].map(s=><option key={s}>{s}</option>)}</select></Row>)}
    <h2 className="font-semibold">Coupons</h2>{cps.map(c=><Row key={c.id} text={`${c.code} — ${c.percent}% off`}><B onClick={()=>run(supabase.from("coupons").delete().eq("id",c.id))}>Delete</B></Row>)}
    <div className="flex gap-2"><input placeholder="CODE" value={cc.code} onChange={e=>setCc({...cc,code:e.target.value})} className="border rounded-lg px-3 py-2"/><input type="number" placeholder="%" value={cc.percent} onChange={e=>setCc({...cc,percent:e.target.value})} className="border rounded-lg px-3 py-2 w-20"/><B onClick={()=>run(supabase.from("coupons").insert({code:cc.code.toUpperCase(),percent:+cc.percent}))}>Add coupon</B></div>
    <h2 className="font-semibold">Settings (payment account &amp; contact)</h2>
    {["bank","account_number","account_name","phone"].map(k=><label key={k} className="block text-sm">{k.replace("_"," ")}<input value={st[k]||""} onChange={e=>setSt({...st,[k]:e.target.value})} className="border rounded-lg px-3 py-2 w-full"/></label>)}
    <B onClick={()=>run(supabase.from("site_settings").upsert(["bank","account_number","account_name","phone"].map(k=>({key:k,value:st[k]||""}))))}>Save settings</B>
    <h2 className="font-semibold">Instant offer requests</h2>{off.map(o=><Row key={o.id} text={`${o.make} ${o.year||""} · ${o.mileage||"?"} km`}><B onClick={()=>{const a=+window.prompt("Offer amount ₦");if(a)run(supabase.from("offers").update({offer_amount:a,status:"offered"}).eq("id",o.id))}}>Send offer</B></Row>)}
    <h2 className="font-semibold">Car history check</h2>
    <select value={hf.car_id} onChange={e=>setHf({...hf,car_id:e.target.value})} className="border rounded-lg px-3 py-2 w-full"><option value="">Select car</option>{lst.cars.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
    {["accident","owners","service","inspection"].map(k=><input key={k} placeholder={k} value={hf[k]} onChange={e=>setHf({...hf,[k]:e.target.value})} className="border rounded-lg px-3 py-2 w-full"/>)}
    <B onClick={()=>hf.car_id&&run(supabase.from("car_history").upsert({car_id:hf.car_id,accident:hf.accident,owners:+hf.owners||null,service_records:hf.service,inspection:hf.inspection}))}>Save history</B>
    <h2 className="font-semibold">Deal of the Day</h2>
    <select value={dl.pid} onChange={e=>setDl({...dl,pid:e.target.value})} className="border rounded-lg px-3 py-2 w-full"><option value="">Select product</option>{lst.products.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select>
    <div className="flex gap-2"><input type="number" placeholder="Deal price ₦" value={dl.price} onChange={e=>setDl({...dl,price:e.target.value})} className="border rounded-lg px-3 py-2"/><input type="number" placeholder="Hours" value={dl.hours} onChange={e=>setDl({...dl,hours:e.target.value})} className="border rounded-lg px-3 py-2 w-24"/>
    <B onClick={()=>dl.pid&&run(supabase.from("products").update({deal_price:+dl.price,deal_ends:new Date(Date.now()+(+dl.hours||24)*3600000).toISOString()}).eq("id",dl.pid))}>Start deal</B></div>
    <h2 className="font-semibold">Featured &amp; availability</h2>{lm.map(r=><Row key={r.t+r.id} text={`${r.t}: ${r.title}${r.featured?" ⭐":""}`}>{r.t==="properties"&&<select value={r.availability||"Available"} onChange={e=>run(supabase.from("properties").update({availability:e.target.value}).eq("id",r.id))} className="border rounded px-2">{["Available","Pending","Sold","Rented"].map(s=><option key={s}>{s}</option>)}</select>}<B onClick={()=>run(supabase.from(r.t).update({featured:!r.featured}).eq("id",r.id))}>{r.featured?"Unfeature":"Feature"}</B><B onClick={()=>run(supabase.from(r.t).update({status:"hidden"}).eq("id",r.id))}>Hide</B></Row>)}
  </main>);}
