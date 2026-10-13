import Link from "next/link";
import { Sparkles, ShieldCheck, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/80 via-pink-50/30 to-slate-50 py-16 md:py-24 border-b border-purple-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200/80 text-purple-900 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>shoeVive • Spesialis Cuci & Restorasi Sneaker Premium</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Kembalikan Kilau & Kebersihan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
              Sepatu Favoritmu
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
            Perawatan cuci sepatu mendalam (Deep Cleaning), unyellowing sol kuning, repaint warna pudar, hingga leather care dengan formula organik aman untuk semua jenis material.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/order-tracking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-pink-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Lacak Status Sepatu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-800 font-semibold px-7 py-3.5 rounded-xl border border-purple-200 hover:border-purple-300 shadow-xs hover:bg-purple-50/50 hover:text-purple-700 transition"
            >
              <span>Lihat Layanan & Harga</span>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-purple-100 text-left">
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur rounded-xl border border-purple-100/70 shadow-xs">
              <div className="p-2 rounded-lg bg-pink-100/80 text-pink-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Kualitas</p>
                <p className="text-sm font-bold text-slate-800">100% Garansi Bersih</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur rounded-xl border border-purple-100/70 shadow-xs">
              <div className="p-2 rounded-lg bg-purple-100/80 text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pengerjaan</p>
                <p className="text-sm font-bold text-slate-800">Cepat & Tepat Waktu</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur rounded-xl border border-purple-100/70 shadow-xs">
              <div className="p-2 rounded-lg bg-fuchsia-100/80 text-fuchsia-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Keamanan</p>
                <p className="text-sm font-bold text-slate-800">Bahan Aman Sesuai Material</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}