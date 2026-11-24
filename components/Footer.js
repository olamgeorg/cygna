import { WHATSAPP } from "@/lib/config";
export default function Footer(){return(<footer className="bg-brand text-white mt-12"><div className="max-w-6xl mx-auto px-4 py-6 text-sm">
<p className="mb-2">Call / WhatsApp: 09134088925</p><p className="mb-2">Never pay outside Cygna. Beware of scams.</p>
<p>© {new Date().getFullYear()} Cygna Consult · cygna.com.ng · Developed by Cygna</p></div>
<a href={`https://wa.me/${WHATSAPP}`} className="fixed bottom-4 right-4 bg-[#25D366] text-black font-bold px-4 py-3 rounded-full shadow-lg" target="_blank">WhatsApp / Call</a></footer>);}
