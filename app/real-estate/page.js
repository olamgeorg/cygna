"use client";
import Section from "@/components/Section";
export default function Page(){return <Section table="properties" type="property" title="Real Estate" cls="sec-estate" meta={(r)=>r.listing_type+' · '+r.bedrooms+' bed · '+r.area}/>;}
