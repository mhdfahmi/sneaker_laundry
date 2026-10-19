"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsappButton from "./WhatsappButton";

// Halaman publik memakai Navbar + Footer + tombol WhatsApp.
// Halaman admin (/admin/...) punya tampilan sendiri, jadi semuanya disembunyikan.
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
