"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  Zap,
  Star,
  Award
} from "lucide-react";

const SUPPORTED_BRANDS = [
  "Nike",
  "Air Jordan",
  "New Balance",
  "Salomon",
  "Yeezy",
  "Adidas Originals",
  "ASICS",
  "Dr. Martens",
  "Vans",
  "Converse",
];

const SAMPLE_TRACKING_CODES = [
  { code: "SL-20261127-078", label: "Antrian Baru" },
  { code: "SL-20261109-081", label: "Sedang Dicuci" },
  { code: "SL-20261114-074", label: "Siap Diambil" },
];

export default function Hero() {
  const router = useRouter();
  const [trackingInput, setTrackingInput] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) {
      router.push("/order-tracking");
      return;
    }
    router.push(`/order-tracking?code=${encodeURIComponent(trackingInput.trim())}`);
  };

  const handleQuickCode = (code: string) => {
    router.push(`/order-tracking?code=${encodeURIComponent(code)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900 text-white pt-16 pb-20 md:pt-20 md:pb-28 border-b border-purple-900/60">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-br from-purple-600/25 via-pink-600/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-pink-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>shoeVive Lab • Studio Restorasi & Cuci Sneaker Premium</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Kembalikan Kilau & Karakter{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
              Sneaker Favoritmu
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-purple-100/90 mb-10 leading-relaxed font-normal">
            Perawatan cuci mendalam (Deep Clean), unyellowing sol menguning, repaint warna pudar, hingga leather conditioning dengan formula ramah lingkungan dan sikat bulu kuda asli.
          </p>

          {/* Instant Order Tracking Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <form
              onSubmit={handleTrackSubmit}
              className="relative p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative w-full flex items-center">
                <Search className="w-5 h-5 text-purple-300 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Masukkan Kode Pesanan (cth: SL-20261127-078)..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-purple-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition border border-transparent focus:border-pink-500/50"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-pink-900/40 transition flex items-center justify-center gap-2"
              >
                <span>Lacak Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Test Tracking Codes */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-purple-300">
              <span className="text-purple-300/80">Contoh Kode:</span>
              {SAMPLE_TRACKING_CODES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleQuickCode(item.code)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-purple-200 hover:text-white transition font-mono flex items-center gap-1.5 cursor-pointer"
                  title={`Klik untuk melacak pesanan ${item.label}`}
                >
                  <span className="font-semibold">{item.code}</span>
                  <span className="text-[10px] text-pink-300/80">({item.label})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-600/25 transition transform hover:-translate-y-0.5"
            >
              <span>Booking Cuci Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/15 backdrop-blur transition hover:border-pink-300/50"
            >
              <span>Daftar Layanan & Harga</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-left mb-12">
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                80+
              </p>
              <p className="text-xs text-purple-200/80 mt-0.5 font-medium">Sepatu Ditangani</p>
            </div>
            <div className="p-2 border-l border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                100%
              </p>
              <p className="text-xs text-purple-200/80 mt-0.5 font-medium">Garansi Cuci Ulang</p>
            </div>
            <div className="p-2 border-l border-white/10">
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" />
                <span className="text-xl sm:text-2xl font-black text-white">4.9 / 5</span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5 font-medium">Rating Kepuasan</p>
            </div>
            <div className="p-2 border-l border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                24-72j
              </p>
              <p className="text-xs text-purple-200/80 mt-0.5 font-medium">Standar SLA Waktu</p>
            </div>
          </div>

          {/* Supported Sneaker Brands Ticker / Grid */}
          <div>
            <p className="text-xs uppercase tracking-widest text-purple-300/80 font-bold mb-4">
              Dukungan Spesialis untuk Material Brand Ternama
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {SUPPORTED_BRANDS.map((brand) => (
                <span
                  key={brand}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-purple-200 hover:text-white hover:border-pink-400/50 hover:bg-white/10 transition"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}