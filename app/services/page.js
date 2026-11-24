"use client";
import Section from "@/components/Section";
export default function Page(){return <Section table="gigs" type="gig" title="Services" cls="sec-services" meta={(r)=>r.category+' · '+r.delivery_days+' days delivery'}/>;}
