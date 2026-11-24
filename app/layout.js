import "./globals.css";import Header from "@/components/Header";import Assistant from "@/components/Assistant";import Footer from "@/components/Footer";
export const metadata={title:"Cygna Consult – Shop, Cars, Real Estate & Services in Lagos",description:"Buy, rent, hire and sell across Lagos, Nigeria."};
export default function RootLayout({children}){return(<html lang="en"><body><Header/>{children}<Assistant/><Footer/></body></html>);}
