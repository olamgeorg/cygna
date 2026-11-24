const get=(k)=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[]}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
export const getCart=()=>get("cygna_cart");export const setCart=(v)=>set("cygna_cart",v);
export const getCmp=(t)=>get("cygna_cmp_"+t);export const setCmp=(t,v)=>set("cygna_cmp_"+t,v);
export function addCart(r){const c=getCart();const i=c.find(x=>x.id===r.id);if(i)i.qty++;else c.push({id:r.id,title:r.title,price:r.price,seller_id:r.seller_id||null,qty:1});setCart(c);}
export function toggleCmp(t,id,max){let c=getCmp(t);if(c.includes(id))c=c.filter(x=>x!==id);else{if(c.length>=max)return false;c.push(id);}setCmp(t,c);return true;}
