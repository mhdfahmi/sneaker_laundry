"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Send, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service_id: "1",
    shoe_brand: "",
    shoe_model: "",
    shoe_color: "",
    shoe_size: "",
    notes: "",
  });

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    // Ambil daftar layanan dari API
    const loadServices = async () => {
      try {
        const resp = await axios.get(`${apiUrl}/api/services`);
        if (resp.data && resp.data.data) {
          setServices(resp.data.data);
          if (resp.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, service_id: String(resp.data.data[0].id) }));
          }
        }
      } catch (e) {
        // Fallback default services
        setServices([
          { id: 1, name: "Deep Cleaning (Rp 50.000)" },
          { id: 2, name: "Fast Cleaning (Rp 30.000)" },
          { id: 3, name: "Repaint & Color Restore (Rp 85.000)" },
          { id: 4, name: "Unyellowing Treatment (Rp 45.000)" },
          { id: 5, name: "Premium Leather Care (Rp 60.000)" },
        ]);
      }
    };

    loadServices();
  }, [apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Simpan pesanan ke Backend Laravel API
      const resp = await axios.post(`${apiUrl}/api/orders`, {
        ...formData,
        service_id: Number(formData.service_id),
      });

      const createdOrder = resp.data?.data || resp.data;
      setSuccessOrder(createdOrder);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal membuat pesanan. Pastikan backend Laravel aktif.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const createWhatsAppLink = (order: any) => {
    const adminPhone = "6281234567890"; // Ganti nomor admin shoeVive
    const serviceName = order.service?.name || "Layanan Cuci Sepatu";
    const text = `Halo Admin shoeVive! 👋%0A%0ASaya baru saja membuat order booking cuci sepatu via website:%0A- *Kode Pesanan:* ${order.order_code}%0A- *Nama:* ${order.customer_name}%0A- *No HP:* ${order.customer_phone}%0A- *Layanan:* ${serviceName}%0A- *Sepatu:* ${order.shoe_brand || "-"} ${order.shoe_model || ""}%0A- *Catatan:* ${order.notes || "Tidak ada"}%0A%0AMohon konfirmasi jadwal drop-off / pick-up sepatu saya. Terima kasih!`;
    return `https://wa.me/${adminPhone}?text=${text}`;
  };

  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>shoeVive Booking System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Booking Online{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
              Cuci Sepatu
            </span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Isi formulir di bawah ini. Pesanan Anda akan tercatat otomatis di sistem <strong>shoeVive</strong> dan dapat langsung diteruskan ke WhatsApp Admin.
          </p>
        </div>

        {/* Success Card */}
        {successOrder ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-pink-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Pesanan Berhasil Diterbitkan!
              </h2>
              <p className="text-slate-600 text-sm">
                Kode pesanan unik Anda telah tersimpan di sistem:
              </p>
              <div className="mt-3 inline-block bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 font-mono font-black text-2xl px-6 py-2.5 rounded-2xl border border-purple-200 shadow-xs">
                {successOrder.order_code}
              </div>
            </div>

            <div className="p-5 bg-purple-50/30 rounded-2xl border border-purple-100 text-left text-xs sm:text-sm space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold text-slate-900">{successOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor HP:</span>
                <span className="font-semibold text-slate-900">{successOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sepatu:</span>
                <span className="font-semibold text-slate-900">
                  {successOrder.shoe_brand} {successOrder.shoe_model || ""}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={createWhatsAppLink(successOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition text-sm transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim ke WhatsApp Admin</span>
              </a>

              <Link
                href={`/order-tracking?code=${successOrder.order_code}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold px-6 py-3.5 rounded-xl border border-purple-200 transition text-sm"
              >
                <span>Lacak Status Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Pelanggan */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-purple-50">
                  1. Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nomor WhatsApp / HP *
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="budi@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Layanan & Sepatu */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-purple-50">
                  2. Detail Sepatu & Layanan
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pilihan Paket Layanan *
                    </label>
                    <select
                      name="service_id"
                      value={formData.service_id}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition font-medium text-slate-800"
                    >
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} {svc.price ? `(Rp ${Number(svc.price).toLocaleString("id-ID")})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Merk / Brand Sepatu *
                      </label>
                      <input
                        type="text"
                        name="shoe_brand"
                        value={formData.shoe_brand}
                        onChange={handleChange}
                        placeholder="Contoh: Nike / Adidas / New Balance"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Model / Seri Sepatu
                      </label>
                      <input
                        type="text"
                        name="shoe_model"
                        value={formData.shoe_model}
                        onChange={handleChange}
                        placeholder="Contoh: Air Jordan 1 / Samba OG"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Warna Utama
                      </label>
                      <input
                        type="text"
                        name="shoe_color"
                        value={formData.shoe_color}
                        onChange={handleChange}
                        placeholder="Contoh: Putih Merah"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Ukuran (Size)
                      </label>
                      <input
                        type="text"
                        name="shoe_size"
                        value={formData.shoe_size}
                        onChange={handleChange}
                        placeholder="Contoh: 42"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Catatan Tambahan / Kondisi Khusus
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Contoh: Sol bagian kiri agak kuning, tolong hati-hati dengan bahan suede."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition"
                    ></textarea>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2 text-sm transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span>Menyimpan Pesanan...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Konfirmasi Booking & Buat Pesanan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
