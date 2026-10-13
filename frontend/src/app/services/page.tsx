"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard, { ServiceItem } from "../components/ServiceCard";
import { Sparkles, Check, HelpCircle } from "lucide-react";
import Link from "next/link";

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: "Deep Cleaning",
    description: "Pembersihan menyeluruh seluruh bagian sepatu (upper, insole, midsole, outsole, dan tali) serta sterilisasi anti-bakteri & jamur.",
    price: 50000,
    duration: "2-3 Hari",
    material: "Semua Bahan (Canvas, Mesh, Suede, Leather)",
  },
  {
    id: 2,
    name: "Fast Cleaning",
    description: "Cuci cepat khusus bagian luar (upper dan midsole). Pilihan tepat untuk penyegaran instan sebelum dipakai bepergian.",
    price: 30000,
    duration: "1 Hari",
    material: "Canvas, Mesh, Synthetic",
  },
  {
    id: 3,
    name: "Repaint & Color Restore",
    description: "Pengecatan ulang sepatu yang pudar atau kusam menggunakan cat khusus sneaker fleksibel dan tahan air.",
    price: 85000,
    duration: "3-5 Hari",
    material: "Leather, Suede, Canvas",
  },
  {
    id: 4,
    name: "Unyellowing Treatment",
    description: "Treatment kimia khusus untuk mengangkat noda kuning akibat oksidasi pada midsole karet/foam agar kembali putih cerah.",
    price: 45000,
    duration: "2-3 Hari",
    material: "Rubber & Foam Midsole",
  },
  {
    id: 5,
    name: "Premium Leather Care",
    description: "Perawatan eksklusif untuk sepatu kulit: Deep conditioning, leather balm nourishing, serta waterproofing sealant.",
    price: 60000,
    duration: "2-3 Hari",
    material: "Genuine & Sintetis Leather",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const resp = await axios.get(`${apiUrl}/api/services`);
        if (resp.data && resp.data.data && Array.isArray(resp.data.data)) {
          setServices(resp.data.data);
        }
      } catch (err) {
        // Gunakan fallback catalog jika backend belum aktif
        console.log("Menggunakan katalog default lokal");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Katalog Perawatan shoeVive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Paket Layanan &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
              Daftar Harga
            </span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Pilih perawatan yang tepat untuk jenis sneaker Anda. Seluruh proses dilakukan secara manual oleh shoes care specialist berpengalaman menggunakan formula pembersih premium.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((item, index) => (
            <ServiceCard
              key={item.id}
              service={item}
              featured={index === 0}
            />
          ))}
        </div>

        {/* Panduan Bahan & Rekomendasi */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-1 block">
              PANDUAN MATERIAL
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Rekomendasi Treatment Berdasarkan Bahan Sepatu
            </h2>
            <p className="text-slate-600 text-sm">
              Bingung memilih paket yang cocok? Kenali karakteristik bahan sepatu Anda di bawah ini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100">
              <span className="font-bold text-slate-900 block mb-1">Canvas & Mesh</span>
              <p className="text-xs text-slate-500 mb-3">Converse, Vans, Nike Air Max Flyknit</p>
              <div className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-purple-600" /> Rekomendasi: Deep Clean
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-pink-50/40 border border-pink-100">
              <span className="font-bold text-slate-900 block mb-1">Suede & Nubuck</span>
              <p className="text-xs text-slate-500 mb-3">Adidas Gazelle, Puma Suede, NB 990</p>
              <div className="text-xs text-pink-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-pink-600" /> Rekomendasi: Suede Detailing
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-fuchsia-50/40 border border-fuchsia-100">
              <span className="font-bold text-slate-900 block mb-1">Leather (Kulit)</span>
              <p className="text-xs text-slate-500 mb-3">Air Force 1, Stan Smith, Dr Martens</p>
              <div className="text-xs text-fuchsia-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-fuchsia-600" /> Rekomendasi: Leather Care
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <span className="font-bold text-slate-900 block mb-1">Midsole Menguning</span>
              <p className="text-xs text-slate-500 mb-3">Semua sol karet atau foam teroksidasi</p>
              <div className="text-xs text-rose-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-rose-600" /> Rekomendasi: Unyellowing
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Masih ragu bahan sepatu Anda? Konsultasikan foto sepatu ke Customer Service shoeVive.</span>
            </div>
            <Link
              href="/booking"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition shadow-md shadow-pink-500/20"
            >
              Konsultasi & Booking Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
