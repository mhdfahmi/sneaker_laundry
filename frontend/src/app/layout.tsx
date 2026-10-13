import "../styles/globals.css";
import { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsappButton from "./components/WhatsappButton";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <title>shoeVive - Jasa Cuci & Restorasi Sepatu Profesional</title>
        <meta
          name="description"
          content="shoeVive - Layanan cuci sepatu, unyellowing, repaint, dan leather care premium dengan garansi 100% bersih."
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}