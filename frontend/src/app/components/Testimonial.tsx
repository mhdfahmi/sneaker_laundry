import { Star, Quote } from "lucide-react";

export default function Testimonial() {
  const reviews = [
    {
      name: "Rian Firmansyah",
      role: "Sneaker Enthusiast",
      shoe: "Air Jordan 4 Bred",
      review: "Gila sih hasilnya! Jordan 4 gue yang kena saus dan lumpur tebal pas nonton konser balik mulus lagi seperti unboxing baru. Wanginya juga enak banget gak bikin pusing.",
      rating: 5,
    },
    {
      name: "Sarah Amanda",
      role: "Daily Commuter",
      shoe: "Adidas Ultraboost Light",
      review: "Fast Cleaning shoeVive beneran cepet dan bersih! Cocok banget buat sepatu lari yang dipake harian. Pelayanan ramah dan fitur tracking statusnya sangat transparan.",
      rating: 5,
    },
    {
      name: "Bagas Wicaksono",
      role: "Collector",
      shoe: "Nike Dunk Low Panda",
      review: "Treatment Unyellowing-nya juara! Midsole kuning bertahun-tahun bisa kembali putih bersih. Sangat recommended buat yang sayang sama koleksi sepatunya.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase mb-2 block">
            SUARA PELANGGAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dipercaya Oleh Ribuan Sneakerhead
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Kepuasan pelanggan adalah prioritas utama kami di <strong>shoeVive</strong> dalam setiap pasang sepatu yang kami bersihkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-purple-50/30 rounded-2xl p-6 sm:p-8 border border-purple-100 flex flex-col justify-between relative shadow-xs hover:shadow-lg hover:shadow-purple-500/10 transition-all"
            >
              <Quote className="w-10 h-10 text-pink-200/60 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-purple-100">
                <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-0.5">
                  <span>{item.role}</span>
                  <span className="font-semibold text-pink-600">{item.shoe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}