"use client";

import { useState } from "react";
import axios from "axios";
import {
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  AlertCircle,
  PackageCheck,
  Phone,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

interface ServiceData {
  id: number;
  name: string;
  price: number;
}

interface OrderData {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shoe_brand?: string;
  shoe_model?: string;
  shoe_color?: string;
  shoe_size?: string;
  shoe_details?: string;
  notes?: string;
  total_price: number;
  status: "queued" | "washing" | "repaint" | "ready_for_delivery" | "completed" | "cancelled";
  estimated_ready_at?: string;
  created_at: string;
  service?: ServiceData;
}

const STATUS_STEPS = [
  { key: "queued", label: "Antrian Masuk", desc: "Sepatu telah diterima & masuk antrian pengerjaan", icon: Clock },
  { key: "washing", label: "Sedang Dicuci", desc: "Pembersihan mendalam (deep clean) sesuai material", icon: Sparkles },
  { key: "repaint", label: "Proses Repaint / Treatment", desc: "Pengerjaan warna ulang / unyellowing / leather care", icon: Layers },
  { key: "ready_for_delivery", label: "Siap Diantar / Diambil", desc: "Sepatu telah kering, steril, & dikemas rapi", icon: Truck },
  { key: "completed", label: "Pesanan Selesai", desc: "Sepatu telah diterima oleh pelanggan", icon: CheckCircle2 },
];

export default function OrderTracking() {
  const [identifier, setIdentifier] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSearch = async (searchCode?: string) => {
    const target = (searchCode || identifier).trim();
    if (!target) {
      setError("Silakan masukkan Kode Pesanan atau Nomor HP Anda.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const resp = await axios.get(`${apiUrl}/api/orders/${encodeURIComponent(target)}`, {
        params: phoneFilter ? { phone: phoneFilter } : {},
      });

      if (resp.data && resp.data.data) {
        setOrder(resp.data.data);
      } else {
        setOrder(resp.data);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Pesanan tidak ditemukan. Mohon periksa kembali kode pesanan atau pastikan server backend berjalan.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "cancelled") return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.status) : -1;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const formatRupiah = (amount?: number) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-900 text-xs font-semibold mb-3">
            <PackageCheck className="w-3.5 h-3.5 text-pink-600" />
            <span>shoeVive Real-Time Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cek Status Pengerjaan Sepatu
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Masukkan kode pesanan (contoh: <code>SL-20241013-001</code>) atau nomor HP yang terdaftar saat order di <strong>shoeVive</strong>.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Pesanan / Nomor HP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: SL-20241013-001 atau 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                    required
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Aksi
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-pink-500/25 transition flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <span>Mencari...</span>
                  ) : (
                    <>
                      <span>Lacak Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Buttons */}
            <div className="pt-3 border-t border-purple-50 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-purple-900">Coba demo order:</span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier("SL-20241013-001");
                  handleSearch("SL-20241013-001");
                }}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-mono transition border border-purple-200/60"
              >
                SL-20241013-001 (Washing)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier("SL-20241013-002");
                  handleSearch("SL-20241013-002");
                }}
                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg font-mono transition border border-pink-200/60"
              >
                SL-20241013-002 (Repaint)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier("SL-20241013-003");
                  handleSearch("SL-20241013-003");
                }}
                className="px-2.5 py-1 bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 rounded-lg font-mono transition border border-fuchsia-200/60"
              >
                SL-20241013-003 (Siap Antar)
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Pencarian Tidak Berhasil</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Progress Tracker */}
        {order && (
          <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
            {/* Order Header Summary */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                    Kode Pesanan
                  </span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                    {order.order_code}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {order.customer_name}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-pink-400" />
                    {order.customer_phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Order: {formatDate(order.created_at)}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-purple-200 block mb-1">Estimasi Selesai:</span>
                <span className="text-sm font-bold text-pink-300 block">
                  {formatDate(order.estimated_ready_at)}
                </span>
                <span className="text-xs text-slate-200 mt-1 block">
                  Total Biaya: <strong>{formatRupiah(order.total_price)}</strong>
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-6 sm:p-8 border-b border-purple-50">
              <h3 className="text-base font-bold text-slate-900 mb-6">
                Tahapan Pengerjaan Sepatu di shoeVive
              </h3>

              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  let badgeStyle = "bg-slate-100 text-slate-400 border-slate-200";
                  if (isCompleted) {
                    badgeStyle = "bg-purple-600 text-white border-purple-600";
                  } else if (isCurrent) {
                    badgeStyle = "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-pink-500 ring-4 ring-pink-100 shadow-md shadow-pink-500/25";
                  }

                  return (
                    <div key={step.key} className="relative flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-2">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? "text-pink-600 font-extrabold"
                              : isCompleted
                              ? "text-purple-700"
                              : "text-slate-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Informasi Sepatu */}
            <div className="p-6 sm:p-8 bg-purple-50/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white p-5 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Detail Layanan
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Paket:</span>
                    <span className="font-semibold text-slate-900">{order.service?.name || "Perawatan Sepatu"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Biaya:</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
                      {formatRupiah(order.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Status Saat Ini:</span>
                    <span className="font-bold uppercase text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Informasi Sepatu & Catatan
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sepatu:</span>
                    <span className="font-semibold text-slate-900">
                      {order.shoe_brand} {order.shoe_model || ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Ukuran & Warna:</span>
                    <span className="text-slate-800">
                      {order.shoe_size ? `Size ${order.shoe_size}` : "-"} {order.shoe_color ? `• ${order.shoe_color}` : ""}
                    </span>
                  </div>
                  {order.notes && (
                    <div className="py-1">
                      <span className="text-slate-500 block mb-0.5">Catatan:</span>
                      <span className="text-slate-700 italic text-xs">{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}