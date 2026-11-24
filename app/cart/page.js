"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/config";
import { getCart, setCart } from "@/lib/store";
export default function Cart(){
  const [c,setC]=useState([]);const [m,setM]=useState("");const [code,setCode]=useState("");const [disc,setDisc]=useState(0);
  useEffect(()=>setC(getCart()),[]);
  const upd=(n)=>{setC(n);setCart(n)};
  const sub=c.reduce((a,x)=>a+x.price*x.qty,0);const total=Math.round(sub*(1-disc/100));
  async function coupon(){const {data}=await supabase.from("coupons").select("percent").eq("code",code.trim().toUpperCase()).maybeSingle();setDisc(data?data.percent:0);setM(data?`Coupon applied: ${data.percent}% off ✓`:"Invalid coupon.");}
  async function checkout(){const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return}
    for(const x of c){const {data,error}=await supabase.from("orders").insert({user_id:user.id,product_id:x.id,quantity:x.qty,total:Math.round(x.price*x.qty*(1-disc/100))}).select("id").single();
      if(error)return setM(error.message);
      await supabase.from("escrow").insert({order_id:data.id,buyer_id:user.id,seller_id:x.seller_id,amount:Math.round(x.price*x.qty*(1-disc/100))});}
    await supabase.from("notifications").insert({user_id:user.id,title:"Order placed",body:`${c.length} item(s), ${naira(total)}`});
    upd([]);setM("Order placed ✓ (pay on delivery). See your dashboard.");}
  return(<main className="max-w-2xl mx-auto px-4 py-6 sec-shop"><h1 className="text-2xl font-bold mb-3">Cart</h1>
    {c.map(x=><div key={x.id} className="bg-[#F5F5F5] rounded-lg p-3 mb-2 flex justify-between items-center gap-2 text-sm"><span>{x.title}<br/>{naira(x.price)}</span>
      <span className="flex items-center gap-2"><button className="border rounded px-2" onClick={()=>upd(c.map(y=>y.id===x.id?{...y,qty:Math.max(1,y.qty-1)}:y))}>−</button>{x.qty}<button className="border rounded px-2" onClick={()=>upd(c.map(y=>y.id===x.id?{...y,qty:y.qty+1}:y))}>+</button>
      <button className="underline" onClick={()=>upd(c.filter(y=>y.id!==x.id))}>Remove</button></span></div>)}
    {!c.length&&<p>Your cart is empty.</p>}
    {c.length>0&&<div className="flex gap-2 mt-3"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Coupon code" className="border rounded-lg px-3 py-2"/><button className="btn-dark" onClick={coupon}>Apply</button></div>}
    {c.length>0&&<div className="mt-3"><p className="font-bold mb-2">Total: {naira(total)}</p><button className="btn" onClick={checkout}>Checkout (pay on delivery)</button></div>}
    {m&&<p className="text-sm mt-3">{m}</p>}
    {m.includes("Order placed")&&<a className="btn mt-3" href="/pay">How to pay</a>}</main>);}
