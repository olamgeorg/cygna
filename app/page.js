"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
const CATS=["Electronics","Fashion","Home","Groceries","Toys","Baby","Sports","Books","Appliances"];
const active=(p)=>p.deal_price&&new Date(p.deal_ends)>new Date();
function Countdown({end}){const [t,setT]=useState("");
  useEffect(()=>{const f=()=>{const d=Math.max(0,new Date(end)-new Date());const h=Math.floor(d/36e5),m=Math.floor(d%36e5/6e4),s=Math.floor(d%6e4/1e3);setT(`${h}h ${m}m ${s}s`)};f();const i=setInterval(f,1000);return()=>clearInterval(i)},[end]);return <span>{t}</span>}
function Card({href,title,price,old,sub}){const off=old?Math.round((1-price/old)*100):0;
  return(<Link href={href} className="bg-white border border-[#EEEEEE] rounded-lg p-3 block min-w-[160px]"><div className="h-28 bg-[#F5F5F5] rounded mb-2 relative">{off>0&&<span className="absolute top-1 right-1 bg-[#FF9900] text-black text-xs font-bold px-1.5 py-0.5 rounded">-{off}%</span>}</div>
    <p className="text-sm line-clamp-2 h-10">{title}</p><p className="font-bold">{naira(price)}</p>{old>0&&<p className="text-xs text-gray-500 line-through">{naira(old)}</p>}{sub&&<p className="text-xs text-gray-600">{sub}</p>}</Link>);}
function Rail({title,href,right,children}){return(<section className="mt-6"><div className="flex items-center justify-between bg-[#232F3E] text-white rounded-t-lg px-4 py-2"><h2 className="font-semibold">{title} {right}</h2><Link href={href} className="text-sm underline">See all</Link></div>
  <div className="flex gap-3 overflow-x-auto p-3 bg-[#F5F5F5] rounded-b-lg">{children}</div></section>);}
export default function Home(){
  const [d,setD]=useState({p:[],c:[],h:[],g:[]});const [rv,setRv]=useState([]);
  useEffect(()=>{try{setRv(JSON.parse(localStorage.getItem("cygna_viewed")||"[]"))}catch{}(async()=>{const q=(t,n)=>supabase.from(t).select("*").eq("status","approved").order("created_at",{ascending:false}).limit(n);
    const [p,c,h,g]=await Promise.all([q("products",12),q("cars",8),q("properties",8),q("gigs",8)]);setD({p:p.data||[],c:c.data||[],h:h.data||[],g:g.data||[]});})();},[]);
  const deals=d.p.filter(active);const first=deals.map(x=>x.deal_ends).sort()[0];
  return(<main className="max-w-6xl mx-auto px-4 py-4">
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <aside className="hidden md:block bg-white border border-[#EEEEEE] rounded-lg py-2">{CATS.map(c=><Link key={c} href={`/shop?q=${c}`} className="block px-4 py-2 text-sm hover:bg-[#F5F5F5]">{c}</Link>)}
        <hr className="my-1"/>{[["Cars","/cars"],["Real Estate","/real-estate"],["Services","/services"]].map(([n,h])=><Link key={h} href={h} className="block px-4 py-2 text-sm font-semibold hover:bg-[#F5F5F5]">{n}</Link>)}</aside>
      <div className="bg-[#232F3E] text-white rounded-lg p-6 md:p-10 flex flex-col justify-center"><p className="text-sm text-[#FF9900] font-bold">CYGNA CONSULT · LAGOS</p>
        <h1 className="text-2xl md:text-4xl font-bold my-2">Shop, drive, live and grow with Cygna.</h1><p className="text-sm text-gray-200 mb-4">Quality products, trusted cars and homes, and professional technology services — pay on delivery or by bank transfer.</p>
        <div className="flex flex-wrap gap-2"><Link href="/shop" className="bg-[#FF9900] text-black font-bold px-4 py-2 rounded-lg">Shop now</Link><Link href="/services" className="bg-white text-black font-bold px-4 py-2 rounded-lg">Our services</Link></div></div></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">{[["Pay on delivery","Order now, pay when it arrives"],["Easy returns","Request a return in your dashboard"],["Secure payment","Bank transfer to Cygna only"],["Support","WhatsApp / Call 09134088925"]].map(([a,b])=><div key={a} className="bg-[#F5F5F5] rounded-lg p-3"><b>{a}</b><p className="text-xs text-gray-600">{b}</p></div>)}</div>
    <div className="md:hidden flex gap-2 overflow-x-auto mt-4">{CATS.map(c=><Link key={c} href={`/shop?q=${c}`} className="whitespace-nowrap border rounded-full px-3 py-1 text-sm">{c}</Link>)}</div>
    {rv.length>0&&<Rail title="Recently viewed" href="/shop">{rv.map(p=><Card key={p.id} href={`/item/${p.t}/${p.id}`} title={p.title} price={p.price}/>)}</Rail>}
    {deals.length>0&&<Rail title="⚡ Flash Sales" href="/shop" right={<span className="ml-2 text-xs bg-[#FF9900] text-black rounded px-2 py-0.5">Ends in <Countdown end={first}/></span>}>{deals.map(p=><Card key={p.id} href={`/item/product/${p.id}`} title={p.title} price={p.deal_price} old={p.price}/>)}</Rail>}
    <Rail title="Top picks for you" href="/shop">{d.p.map(p=><Card key={p.id} href={`/item/product/${p.id}`} title={p.title} price={active(p)?p.deal_price:p.price} old={active(p)?p.price:0} sub={p.stock>0?"In stock":"Out of stock"}/>)}</Rail>
    <Rail title="Cars" href="/cars">{d.c.map(p=><Card key={p.id} href={`/item/car/${p.id}`} title={p.title} price={p.price} sub={`${p.year} · ${p.area}`}/>)}</Rail>
    <Rail title="Homes & Land" href="/real-estate">{d.h.map(p=><Card key={p.id} href={`/item/property/${p.id}`} title={p.title} price={p.price} sub={`${p.listing_type} · ${p.area}`}/>)}</Rail>
    <Rail title="Professional Services" href="/services">{d.g.map(p=><Card key={p.id} href={`/item/gig/${p.id}`} title={p.title} price={p.price} sub={p.category}/>)}</Rail>
  </main>);}
