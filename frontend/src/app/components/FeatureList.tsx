import {
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Award,
  Feather,
  Sun,
  Shield,
  Layers,
  CheckCircle2
} from "lucide-react";

export default function FeatureList() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Kualitas Standar Laboratorium</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Perawatan Tingkat Dokter untuk Koleksi Sneaker
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Di <strong>shoeVive</strong>, kami tidak sekadar mencuci dengan air dan deterjen biasa. Kami merawat tekstur, memulihkan elastisitas kulit, dan meregenerasi warna original sepatu Anda.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Bento 1: Large Featured Card (2 cols, 2 rows) */}
          <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 text-white relative overflow-hidden flex flex-col justify-between group shadow-xl shadow-purple-950/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/25 transition-all duration-500" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-bold">
                Medical-Grade Protocol
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-3 tracking-tight">
                Sterilisasi Oksigen O3 & Anti-Jamur
              </h3>
              <p className="text-sm text-purple-200/90 leading-relaxed max-w-lg mb-6">
                Chamber sterilisasi ozon (O3) membasmi 99.9% bakteri pembawa aroma asam dan spora jamur di insole sepatu tanpa merendam atau merusak struktur lem internal midsole.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-black text-pink-400">99.9%</p>
                <p className="text-xs text-purple-200/70 mt-0.5">Bakteri & Jamur Terbasmi</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-purple-300">0%</p>
                <p className="text-xs text-purple-200/70 mt-0.5">Residu Kimia Berbahaya</p>
              </div>
            </div>
          </div>

          {/* Bento 2: Sikat Bulu Kuda Asli */}
          <div className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                100% Horsehair Detailing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sikat bulu kuda asli Jerman super halus untuk menjaga bulu suede & nubuck tetap lembut dan anti-rontok.
              </p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Aman untuk Suede Premium</span>
            </div>
          </div>

          {/* Bento 3: Unyellowing Lightbox */}
          <div className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-pink-300 hover:bg-white hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                De-Oksidasi Sol UV Lightbox
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Membalikkan reaksi oksidasi sinar matahari yang menguningkan midsole & icy soles menjadi putih bersih kembali.
              </p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-pink-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Teknologi Sol Dingin</span>
            </div>
          </div>

          {/* Bento 4: Tracking Realtime */}
          <div className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Tracking Status Real-Time
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pantau progres sepatu dari antrian, proses pencucian, repaint hingga siap diambil langsung via web tanpa perlu repot chat tanya-tanya.
              </p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>API Live Database Sync</span>
            </div>
          </div>

          {/* Bento 5: Wide Card Nanotech Shield & Repaint (2 cols) */}
          <div className="md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-white border border-purple-200/70 flex flex-col sm:flex-row items-center gap-6 justify-between group">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center mb-4 shadow-md shadow-pink-500/20 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Nanotech Hydrophobic Shielding
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Lapisan pelindung nano-partikel tak terlihat yang menolak tumpahan air, noda kecap, cipratan kopi, dan lumpur jalanan hingga 30 hari pemakaian.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-purple-900">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tahan Air Hujan
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Anti-Crease Leather
                </span>
              </div>
            </div>
          </div>

          {/* Bento 6: Garansi Cuci Ulang */}
          <div className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-rose-300 hover:bg-white hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                100% Garansi Cuci Ulang
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tidak puas dengan hasil pencucian? Laporkan dalam 1x24 jam dan kami akan cuci ulang secara gratis tanpa ribet.
              </p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Tanpa Biaya Tambahan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}