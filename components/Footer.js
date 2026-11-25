import { WHATSAPP } from "@/lib/config";
export default function Footer(){return(<footer className="bg-brand text-white mt-12"><p className="text-center text-sm py-4">© {new Date().getFullYear()} CYGNA Consult </p>
<a href={`https://wa.me/${WHATSAPP}`} className="fixed bottom-4 right-4 bg-[#25D366] text-black font-bold px-4 py-3 rounded-full shadow-lg z-50" target="_blank">WhatsApp / Call</a></footer>);}
