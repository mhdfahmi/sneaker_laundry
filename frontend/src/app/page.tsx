import Hero from "./components/Hero";
import FeatureList from "./components/FeatureList";
import Gallery from "./components/Gallery";
import Testimonial from "./components/Testimonial";
import ServiceCard from "./components/ServiceCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const featuredServices = [
    {
      id: 1,
      name: "Deep Cleaning",
      description: "Pembersihan menyeluruh seluruh bagian sepatu (upper, insole, midsole, outsole, dan tali) serta sterilisasi anti-bakteri & jamur.",
      price: 50000,
      duration: "2-3 Hari",
      material: "Semua Bahan (Canvas, Mesh, Suede, Leather)",
      featured: true,
    },
    {
      id: 2,
      name: "Fast Cleaning",
      description: "Cuci cepat khusus bagian luar (upper dan midsole). Pilihan tepat untuk penyegaran instan sebelum dipakai bepergian.",
      price: 30000,
      duration: "1 Hari",
      material: "Canvas, Mesh, Synthetic",
      featured: false,
    },
    {
      id: 3,
      name: "Repaint & Color Restore",
      description: "Pengecatan ulang sepatu yang pudar atau kusam menggunakan cat khusus sneaker fleksibel dan tahan air.",
      price: 85000,
      duration: "3-5 Hari",
      material: "Leather, Suede, Canvas",
      featured: false,
    },
  ];

  return (
    <>
      <Hero />
      <FeatureList />

      {/* Ringkasan Layanan */}
      <section className="py-20 bg-slate-50/60 border-t border-purple-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-2 block">
                PILIHAN PAKET POPULER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Layanan Perawatan Favorit di shoeVive
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-pink-600 transition"
            >
              <span>Lihat Semua Paket & Harga</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                featured={service.featured}
              />
            ))}
          </div>
        </div>
      </section>

      <Gallery />
      <Testimonial />

      {/* Final Call To Action Banner */}
      <section className="py-18 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-pink-200 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Tampil Percaya Diri dengan Sepatu Bersih</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Jangan Biarkan Sneaker Kotor Merusak Penampilanmu
          </h2>
          <p className="text-purple-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Konsultasikan kondisi sepatu Anda sekarang secara gratis ke team ahli <strong>shoeVive</strong> atau langsung pesan dan lacak statusnya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-pink-900/30 transition transform hover:-translate-y-0.5"
            >
              Booking Cuci Sekarang
            </Link>
            <Link
              href="/order-tracking"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition"
            >
              Lacak Pesanan Saya
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}