import { supabase } from "@/lib/supabase";
const hits=new Map();
export async function POST(req){
  const ip=req.headers.get("x-forwarded-for")||"x";const now=Date.now();const h=(hits.get(ip)||[]).filter(t=>now-t<60000);
  if(h.length>=10)return Response.json({reply:"Too many requests. Please wait a minute."});hits.set(ip,[...h,now]);
  let body;try{body=await req.json()}catch{return Response.json({reply:"Bad request."})}
  const key=process.env.ANTHROPIC_API_KEY;
  if(!key)return Response.json({reply:"The AI assistant is not switched on yet. Try Smart search at /search, or WhatsApp us on 09134088925."});
  const msgs=(body.messages||[]).slice(-10).map(m=>({role:m.role==="assistant"?"assistant":"user",content:String(m.content||"").slice(0,1000)}));
  if(!msgs.length||msgs[0].role!=="user")return Response.json({reply:"Ask me something."});
  let ctx="";
  try{for(const [t,f] of [["products","title,price"],["cars","title,price,area"],["properties","title,price,area,listing_type"],["gigs","title,price,category"]]){
    const {data}=await supabase.from(t).select(f).eq("status","approved").limit(8);ctx+=`${t}: ${JSON.stringify(data||[])}\n`;}}catch{}
  const system=body.mode==="job"
    ?"Write a clear, friendly freelance job post (about 120 words) from the user's notes: scope, deliverables, skills, timeline. Plain text only. Prices in Naira."
    :`You are Cygna Consult's shopping assistant for Lagos, Nigeria (Shop, Cars, Real Estate, Services). Be brief and helpful. Prices are in Naira (₦). Only recommend items from this live data and say if nothing matches:\n${ctx}\nPayments are by bank transfer shown on /pay; never ask people to pay anyone else. For help, WhatsApp 09134088925. Do not give legal or financial guarantees.`;
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","content-type":"application/json"},
    body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||"claude-sonnet-5-5",max_tokens:600,system,messages:msgs})});
    const d=await r.json();return Response.json({reply:d.content?.[0]?.text||"Sorry, I could not answer right now."});}
  catch{return Response.json({reply:"Sorry, the assistant is unavailable right now."});}}
