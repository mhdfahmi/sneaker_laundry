import Link from "next/link";
import { Sparkles, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-purple-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                shoe<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Vive</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Layanan perawatan, cuci, repaint, dan restorasi sepatu premium dengan standar pengerjaan profesional dan 100% bergaransi.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-pink-400 transition">Beranda</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-pink-400 transition">Paket & Harga</Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-pink-400 transition">Cek Status Pesanan</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-pink-400 transition">Booking Online</Link>
              </li>
            </ul>
          </div>

          {/* Layanan Populer */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Layanan Favorit
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>Deep Cleaning All Material</li>
              <li>Fast Cleaning 1 Hari</li>
              <li>Unyellowing Midsole</li>
              <li>Repaint & Color Restore</li>
              <li>Leather Care & Conditioning</li>
            </ul>
          </div>

          {/* Kontak & Lokasi */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Workshop & Kontak
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                <span>Jl. Shoes Care No. 123, Workshop Pusat</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Setiap Hari (09.00 - 21.00 WIB)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2025 shoeVive. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat dengan Next.js, Tailwind CSS & Laravel API</p>
        </div>
      </div>
    </footer>
  );
}
