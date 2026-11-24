"use client";
import Section from "@/components/Section";
export default function Page(){return <Section table="cars" type="car" title="Cars" cls="sec-cars" meta={(r)=>r.year+' · '+Number(r.mileage).toLocaleString()+' km · '+r.fuel+' · '+r.area}/>;}
