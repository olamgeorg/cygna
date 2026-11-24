"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const GROUPS = [
  [
    "Browse",
    [
      ["Shop", "/shop"],
      ["Cars", "/cars"],
      ["Real Estate", "/real-estate"],
      ["Services", "/services"],
    ],
  ],
  [
    "Tools",
    [
      ["Smart Search", "/search"],
      ["Jobs", "/jobs"],
      ["Sell / List", "/sell"],
      ["Calculators & Valuation", "/tools"],
      ["Cart", "/cart"],
    ],
  ],
  [
    "My Account",
    [
      ["Dashboard", "/dashboard"],
      ["Messages", "/messages"],
      ["Contracts", "/contracts"],
      ["Verify ID", "/verify"],
      ["Renter Profile", "/renter"],
      ["Instant Car Offer", "/offer"],
      ["Pay / Bank Details", "/pay"],
    ],
  ],
];
export default function Header() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const load = async (u) => {
      setUser(u);
      if (!u) {
        setRole(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();
      setRole(data?.role || null);
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: s } = supabase.auth.onAuthStateChange((_e, ses) =>
      load(ses?.user || null)
    );
    return () => s.subscription.unsubscribe();
  }, []);
  const close = () => setOpen(false);
  return (
    <header className="bg-brand text-white relative z-40"> <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3"> <Link href="/" className="text-xl font-bold flex-1" onClick={close}> Cygna <span className="font-normal">Consult</span> </Link> <Link href="/cart" className="text-sm" onClick={close}> 🛒 Cart </Link> <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="text-2xl leading-none px-2" > {open ? "✕" : "☰"} </button> </div> {open && ( <nav className="absolute left-0 right-0 bg-brand border-t border-white/20 max-h-[80vh] overflow-y-auto shadow-xl"> <div className="max-w-6xl mx-auto px-4 py-3 grid gap-4 sm:grid-cols-3"> {GROUPS.map( ([g, items]) => (g !== "My Account" || user) && ( <div key={g}> <p className="text-xs uppercase tracking-wide text-gray-300 mb-1"> {g} </p> {items.map(([n, h]) => ( <Link key={h} href={h} onClick={close} className="block py-2 text-sm border-b border-white/10" > {n} </Link> ))} </div> ) )} <div> {role === "admin" && ( <> <p className="text-xs uppercase tracking-wide text-gray-300 mb-1"> Staff </p> <Link href="/admin" onClick={close} className="block py-2 text-sm font-bold border-b border-white/10" > ⚙️ Admin panel </Link> </> )} <div className="pt-2"> {user ? ( <button onClick={() => { supabase.auth.signOut(); close(); }} className="text-sm underline" > Sign out </button> ) : ( <Link href="/auth" onClick={close} className="text-sm underline" > Sign in / Sign up </Link> )} </div> </div> </div> </nav>
      )}
    </header>
  );
}
