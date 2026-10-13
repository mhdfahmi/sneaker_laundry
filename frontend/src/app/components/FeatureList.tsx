import { Sparkles, Shield, RefreshCw, Smartphone, Award, Feather } from "lucide-react";

export default function FeatureList() {
  const features = [
    {
      icon: Feather,
      title: "Pembersih Khusus & Organik",
      desc: "Formula ramah lingkungan yang aman untuk tekstil, suede lembut, dan kulit premium tanpa menyebabkan luntur.",
      color: "text-pink-600 bg-pink-50 border-pink-100",
    },
    {
      icon: Sparkles,
      title: "Teknik Sikat Multi-Karakter",
      desc: "Menggunakan sikat bulu kuda asli untuk bahan sensitif dan nylon kaku khusus sol agar noda terangkat maksimal.",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      icon: Shield,
      title: "Sterilisasi UV & Anti-Bakteri",
      desc: "Penyinaran lampu ultraviolet dan treatment semprot anti-bakteri untuk membasmi kuman dan bau apek membandel.",
      color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
    },
    {
      icon: Smartphone,
      title: "Lacak Status Real-time",
      desc: "Pantau setiap tahapan pengerjaan sepatu Anda secara transparan langsung lewat website shoeVive.",
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      icon: RefreshCw,
      title: "Garansi Cuci Ulang",
      desc: "Jika hasil cucian belum sesuai standar kepuasan Anda, kami berikan cuci ulang 100% gratis tanpa biaya tambahan.",
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      icon: Award,
      title: "Teknisi Berpengalaman",
      desc: "Dikerjakan oleh shoes care specialist berpengalaman yang telah menangani ribuan pasang sneaker desainer & harian.",
      color: "text-purple-700 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-2 block">
            KUALITAS TERJAMIN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perawatan Tingkat Dokter Untuk Sepatu Kesayangan
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Di <strong>shoeVive</strong>, kami tidak hanya sekadar mencuci, namun memulihkan tekstur, warna, dan kesegaran sepatu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-7 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200/80 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}