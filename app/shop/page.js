"use client";
import Section from "@/components/Section";
export default function Page(){return <Section table="products" type="product" title="Shop" cls="sec-shop" meta={(r)=>r.category+' · '+r.brand+' · '+(r.stock>0?'In stock':'Out of stock')}/>;}
