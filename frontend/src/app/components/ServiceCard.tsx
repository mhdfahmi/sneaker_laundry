import Link from "next/link";
import { Clock, Layers, Sparkles } from "lucide-react";

export interface ServiceItem {
  id: number;
  name: string;
  slug?: string;
  description: string;
  price: number;
  duration?: string;
  material?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  featured?: boolean;
}

export default function ServiceCard({ service, featured = false }: ServiceCardProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 relative ${
        featured
          ? "border-pink-500 bg-white shadow-xl shadow-pink-500/10 ring-2 ring-pink-500/20"
          : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-1 px-3.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shadow-pink-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Paling Favorit
        </span>
      )}

      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Price Tag */}
        <div className="mb-6 pb-6 border-b border-purple-50">
          <span className="text-xs text-slate-500 font-medium block">Mulai dari</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
              {formatRupiah(service.price)}
            </span>
            <span className="text-xs text-slate-500">/ pasang</span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="space-y-2.5 mb-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>Estimasi: <strong>{service.duration || "2-3 Hari"}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-600 flex-shrink-0" />
            <span>Material: <strong>{service.material || "Semua Bahan"}</strong></span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Link
          href={`/booking?service_id=${service.id}`}
          className={`w-full inline-flex items-center justify-center font-bold py-3.5 px-4 rounded-xl transition text-sm ${
            featured
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md shadow-pink-500/25"
              : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60"
          }`}
        >
          Pesan Layanan Ini
        </Link>
      </div>
    </div>
  );
}