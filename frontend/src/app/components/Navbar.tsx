"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, Search, PhoneCall } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan & Harga", href: "/services" },
    { name: "Cek Status Pesanan", href: "/order-tracking", icon: Search },
    { name: "Booking Online", href: "/booking" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 block leading-tight">
              shoe<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Vive</span>
            </span>
            <span className="text-[10px] text-purple-700/80 font-bold tracking-widest uppercase">
              Premium Shoes Care & Laundry
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-bold shadow-xs border border-purple-200/70"
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-50"
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${active ? "text-purple-600" : "text-slate-400"}`} />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20ShoeVive!%20Saya%20ingin%20konsultasi%20cuci%20sepatu."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-pink-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-purple-600 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-bold border border-purple-200"
                    : "text-slate-700 hover:text-purple-600 hover:bg-slate-50"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20ShoeVive!%20Saya%20ingin%20konsultasi%20cuci%20sepatu."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl mt-3 shadow-md shadow-pink-500/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hubungi via WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
}
