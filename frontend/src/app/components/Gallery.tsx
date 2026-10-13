import { Check } from "lucide-react";

export default function Gallery() {
  const showcase = [
    {
      title: "Deep Cleaning & Detailing",
      shoe: "Nike Air Max 97 White",
      problem: "Noda lumpur pekat di jaring mesh dan insole berdebu",
      result: "Serat kain kembali cerah, insole wangi, sol steril bebas bakteri",
      tag: "Deep Clean",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      title: "Unyellowing Midsole Treatment",
      shoe: "Air Jordan 1 Retro High",
      problem: "Midsole menguning parah akibat oksidasi sinar UV dan usia sepatu",
      result: "Sol kembali putih cerah alami tanpa merusak tekstur karet sol",
      tag: "Unyellowing",
      badgeColor: "bg-pink-100 text-pink-700",
    },
    {
      title: "Color Restore & Repaint",
      shoe: "Adidas Samba OG Black",
      problem: "Warna kulit pudar, goresan di bagian tumit, suede kusam",
      result: "Warna hitam kembali pekat, lapisan fleksibel tahan gores dan air",
      tag: "Repaint",
      badgeColor: "bg-fuchsia-100 text-fuchsia-700",
    },
    {
      title: "Luxury Leather Care",
      shoe: "Dr. Martens 1460 Smooth Leather",
      problem: "Kulit kering pecah-pecah kusam dan tidak terlindungi",
      result: "Kulit kembali lentur, kilau alami terjaga dengan balm anti-air",
      tag: "Leather Care",
      badgeColor: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-b border-purple-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-2 block">
            TRANSFORMASI NYATA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Hasil Before & After
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Lihat bagaimana <strong>shoeVive</strong> menghidupkan kembali performa dan keindahan estetika sepatu favorit Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcase.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all"
            >
              {/* Visual simulated comparison box */}
              <div className="relative bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[190px]">
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-pink-300 font-semibold tracking-wider">shoeVive Lab</span>
                </div>

                <div>
                  <h4 className="text-xl font-bold tracking-tight text-white mb-1">{item.shoe}</h4>
                  <p className="text-sm text-purple-200">{item.title}</p>
                </div>
              </div>

              {/* Detail Before vs After */}
              <div className="p-6 space-y-4">
                <div className="bg-red-50/80 p-3.5 rounded-xl border border-red-100 text-sm">
                  <span className="font-bold text-red-700 block mb-1">🔴 Sebelum Perawatan (Before):</span>
                  <p className="text-slate-700 text-xs sm:text-sm">{item.problem}</p>
                </div>

                <div className="bg-purple-50/80 p-3.5 rounded-xl border border-purple-100 text-sm">
                  <span className="font-bold text-purple-800 flex items-center gap-1.5 mb-1">
                    <Check className="w-4 h-4 text-purple-600" /> Setelah Perawatan (After):
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm">{item.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}