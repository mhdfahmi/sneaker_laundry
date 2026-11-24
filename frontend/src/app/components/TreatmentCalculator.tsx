"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Clock, ShieldCheck, Zap } from "lucide-react";

interface MaterialOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ConditionOption {
  id: string;
  name: string;
  description: string;
  suggestedService: string;
  serviceId: number;
  price: number;
  duration: string;
  recommendedAddon?: string;
}

const MATERIALS: MaterialOption[] = [
  { id: "canvas", name: "Canvas / Mesh", icon: "👟", description: "Bahan kain rajut atau jaring seperti Converse, Vans, Yeezy 350" },
  { id: "leather", name: "Genuine / Synthetic Leather", icon: "✨", description: "Kulit halus seperti Air Jordan 1, AF1, Stan Smith, Samba" },
  { id: "suede", name: "Suede / Nubuck", icon: "🧴", description: "Bahan beludru bertekstur lembut seperti New Balance 990, Puma Suede" },
  { id: "hybrid", name: "Hybrid / Designer Sneaker", icon: "💎", description: "Kombinasi multi-material kompleks seperti Balenciaga, Salomon XT-6" },
];

const CONDITIONS: Record<string, ConditionOption[]> = {
  canvas: [
    {
      id: "light",
      name: "Debu Ringan & Noda Harian",
      description: "Penyegaran cepat untuk bagian luar sebelum dipakai beraktivitas.",
      suggestedService: "Fast Cleaning",
      serviceId: 2,
      price: 30000,
      duration: "1 Hari",
    },
    {
      id: "heavy",
      name: "Lumpur, Noda Pekat & Bau Apek",
      description: "Pembersihan total menyeluruh dari upper, insole hingga sterilisasi anti-jamur.",
      suggestedService: "Deep Cleaning",
      serviceId: 1,
      price: 50000,
      duration: "2-3 Hari",
      recommendedAddon: "Sterilisasi UV & Anti-Odor Organik",
    },
    {
      id: "faded",
      name: "Warna Pudar & Kusam Terpapar Matahari",
      description: "Pengembalian pigmen warna asli dengan formula pewarna tekstil khusus.",
      suggestedService: "Repaint & Color Restore",
      serviceId: 3,
      price: 85000,
      duration: "3-5 Hari",
    },
  ],
  leather: [
    {
      id: "light",
      name: "Debu & Noda Luar Ringan",
      description: "Pembersihan cepat upper dan midsole tanpa merusak lapisan coating kulit.",
      suggestedService: "Fast Cleaning",
      serviceId: 2,
      price: 30000,
      duration: "1 Hari",
    },
    {
      id: "yellowing",
      name: "Midsole / Sol Menguning (Yellowing)",
      description: "De-oksidasi sol kuning akibat reaksi sinar matahari kembali ke putih bersih.",
      suggestedService: "Unyellowing Sol",
      serviceId: 4,
      price: 60000,
      duration: "2-4 Hari",
      recommendedAddon: "Midsole UV Lightbox De-oxidation",
    },
    {
      id: "heavy_leather",
      name: "Kotor Menyeluruh + Butuh Leather Nourish",
      description: "Deep clean menyeluruh dilanjutkan conditioning minyak mink oil untuk mencegah retak/crease.",
      suggestedService: "Leather Care & Deep Clean",
      serviceId: 5,
      price: 75000,
      duration: "2-3 Hari",
      recommendedAddon: "Mink Oil Conditioning & Weather Shield",
    },
  ],
  suede: [
    {
      id: "suede_clean",
      name: "Debu Menempel & Bulu Suede Kaku",
      description: "Deep cleaning menggunakan sikat bulu kuda asli super lembut dan suede brass reviver.",
      suggestedService: "Deep Cleaning (Suede Protocol)",
      serviceId: 1,
      price: 50000,
      duration: "2-3 Hari",
      recommendedAddon: "Suede Nap Brushing & Water Repellent",
    },
    {
      id: "suede_faded",
      name: "Warna Suede Memutih / Pudar",
      description: "Restorasi pewarna suede cair khusus untuk mengembalikan kepekatan warna aslinya.",
      suggestedService: "Repaint & Suede Re-dye",
      serviceId: 3,
      price: 85000,
      duration: "3-5 Hari",
    },
  ],
  hybrid: [
    {
      id: "hybrid_deep",
      name: "Perawatan Menyeluruh Multi-Material",
      description: "Pembersihan presisi per panel material untuk menjaga keutuhan struktur sepatu premium.",
      suggestedService: "Deep Cleaning Premium",
      serviceId: 1,
      price: 50000,
      duration: "2-3 Hari",
      recommendedAddon: "Double Sterilization Ozone Chamber",
    },
    {
      id: "hybrid_full",
      name: "Restorasi Lengkap (Cuci + Unyellowing)",
      description: "Kombinasi pembersihan mendalam dan treatment unyellowing sol untuk hasil seperti baru.",
      suggestedService: "Deep Clean + Unyellowing Combo",
      serviceId: 4,
      price: 110000,
      duration: "3-4 Hari",
      recommendedAddon: "Nanotech Hydrophobic Shield",
    },
  ],
};

export default function TreatmentCalculator() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("canvas");
  const conditions = CONDITIONS[selectedMaterial] || CONDITIONS.canvas;
  const [selectedConditionId, setSelectedConditionId] = useState<string>(conditions[0].id);

  const activeCondition =
    conditions.find((c) => c.id === selectedConditionId) || conditions[0];

  const handleMaterialChange = (matId: string) => {
    setSelectedMaterial(matId);
    const newConditions = CONDITIONS[matId] || CONDITIONS.canvas;
    setSelectedConditionId(newConditions[0].id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/25 to-slate-50 border-t border-purple-100/60 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/25 to-pink-200/25 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/90 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-pink-600" />
            <span>Kalkulator Estimasi Pintar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Bingung Pilih Perawatan yang Pas?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Pilih jenis material sepatu dan kondisi keluhan Anda. Algoritma kami akan merekomendasikan treatment spesifik dengan perkiraan biaya transparan.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-900/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Input Selection Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-100">
            {/* Step 1: Material */}
            <div className="mb-8">
              <label className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                Pilih Material Utama Sepatu
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIALS.map((mat) => {
                  const isSelected = selectedMaterial === mat.id;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => handleMaterialChange(mat.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-600/20"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-2xl">{mat.icon}</span>
                        <span className={`text-sm font-bold ${isSelected ? "text-purple-900" : "text-slate-800"}`}>
                          {mat.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{mat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Condition / Problem */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                Kondisi / Masalah yang Ingin Dibereskan
              </label>
              <div className="space-y-2.5">
                {conditions.map((cond) => {
                  const isSelected = selectedConditionId === cond.id;
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setSelectedConditionId(cond.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? "border-pink-500 bg-pink-50/70 shadow-sm ring-2 ring-pink-500/20"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? "text-pink-950" : "text-slate-800"}`}>
                          {cond.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{cond.description}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "border-pink-600 bg-pink-600 text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Instant Recommendation Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle light accent */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-pink-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Rekomendasi Teknisi shoeVive</span>
                </div>
                <span className="text-[11px] font-mono text-purple-300/80 uppercase">AI Lab Spec</span>
              </div>

              <p className="text-xs text-purple-200 uppercase tracking-widest font-bold">Paket Terbaik</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2 tracking-tight">
                {activeCondition.suggestedService}
              </h3>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed mb-6">
                {activeCondition.description}
              </p>

              {/* Price & Turnaround Specs */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-200">Perkiraan Biaya</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                      Rp {activeCondition.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[11px] text-purple-300 block">/ pasang</span>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    Waktu Pengerjaan
                  </span>
                  <span className="font-bold text-white">{activeCondition.duration}</span>
                </div>

                {activeCondition.recommendedAddon && (
                  <div className="flex items-start justify-between text-xs text-purple-200 pt-1">
                    <span className="flex items-center gap-1.5 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                      Prosedur Lab:
                    </span>
                    <span className="font-semibold text-pink-200 text-right text-[11px]">
                      {activeCondition.recommendedAddon}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-purple-200/80 mb-6">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Garansi cuci ulang 100% jika belum bersih</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dibersihkan manual dengan sikat khusus material</span>
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/booking?service=${activeCondition.serviceId}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-900/40 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center text-sm"
            >
              <span>Booking Treatment Ini</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
