"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  ArrowRight,
  Copy,
  Check,
  MessageCircle
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

const REAL_DEMO_ORDERS = [
  { code: "SL-20261127-078", label: "Antrian Masuk", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { code: "SL-20261109-081", label: "Sedang Dicuci", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { code: "SL-20261114-074", label: "Siap Diambil", color: "text-pink-700 bg-pink-50 border-pink-200" },
  { code: "SL-20261112-079", label: "Selesai", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setIdentifier(codeParam);
      handleSearch(codeParam);
    }
  }, [searchParams]);

  const copyOrderCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const whatsappMessage = order
    ? encodeURIComponent(
        `Halo shoeVive Studio, saya ingin menanyakan progres pesanan saya:\n\n• Kode: ${order.order_code}\n• Nama: ${order.customer_name}\n• Sepatu: ${order.shoe_brand || ""} ${order.shoe_model || ""}\n• Status: ${order.status}\n\nTerima kasih!`
      )
    : "";

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-900 text-xs font-bold mb-3 shadow-xs">
            <PackageCheck className="w-4 h-4 text-pink-600" />
            <span>shoeVive Real-Time Tracking Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Lacak Status Pengerjaan Sepatu
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Pantau setiap tahapan pembersihan dan restorasi sepatu kesayangan Anda secara transparan langsung dari sistem workstation teknisi <strong>shoeVive</strong>.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-900/5 border border-purple-100 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Kode Pesanan / Nomor Handphone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: SL-20261127-078 atau 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                    required
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Aksi
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-pink-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {loading ? (
                    <span>Mencari di Database...</span>
                  ) : (
                    <>
                      <span>Lacak Pesanan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Buttons from Genuine MySQL Database */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Coba Demo Pesanan Asli di Database:</span>
              {REAL_DEMO_ORDERS.map((demo) => (
                <button
                  key={demo.code}
                  type="button"
                  onClick={() => {
                    setIdentifier(demo.code);
                    handleSearch(demo.code);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition cursor-pointer hover:shadow-xs ${demo.color}`}
                >
                  <span>{demo.code}</span>
                  <span className="opacity-75 ml-1 text-[10px]">({demo.label})</span>
                </button>
              ))}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Pesanan Tidak Ditemukan</p>
                <p className="text-xs mt-0.5 text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Progress Tracker */}
        {order && (
          <div className="bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-100 overflow-hidden">
            {/* Order Header Summary */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-[11px] uppercase tracking-widest text-purple-300 font-bold">
                    KODE PESANAN
                  </span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-sm">
                    {order.order_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyOrderCode(order.order_code)}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Salin kode pesanan"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copied ? "Tersalin!" : "Salin"}</span>
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {order.customer_name}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200/90 mt-2.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pink-400" />
                    {order.customer_phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Masuk: {formatDate(order.created_at)}
                  </span>
                </div>
              </div>

              <div className="relative z-10 text-left sm:text-right bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <span className="text-xs text-purple-200 block mb-1">Estimasi Siap Ambil:</span>
                <span className="text-base font-black text-pink-300 block">
                  {formatDate(order.estimated_ready_at)}
                </span>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between sm:justify-end gap-2 text-xs">
                  <span className="text-slate-300">Total Biaya:</span>
                  <span className="font-extrabold text-white text-sm">
                    {formatRupiah(order.total_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-6 sm:p-10 border-b border-purple-50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Workflow Pengerjaan Sepatu
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live timeline tahapan perawatan berdasarkan log pengerjaan teknisi.
                  </p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Sync Active</span>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  let badgeStyle = "bg-slate-100 text-slate-400 border-slate-200";
                  if (isCompleted) {
                    badgeStyle = "bg-purple-600 text-white border-purple-600";
                  } else if (isCurrent) {
                    badgeStyle = "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-pink-500 ring-4 ring-pink-200 shadow-lg shadow-pink-500/25";
                  }

                  return (
                    <div key={step.key} className="relative flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}
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
            <div className="p-6 sm:p-8 bg-slate-50/60 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Detail Layanan Perawatan
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Paket Layanan:</span>
                    <span className="font-bold text-slate-900">{order.service?.name || "Perawatan Sepatu"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Biaya Layanan:</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
                      {formatRupiah(order.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Status Saat Ini:</span>
                    <span className="font-bold uppercase text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    Informasi Sepatu Pelanggan
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Brand / Model:</span>
                      <span className="font-bold text-slate-900">
                        {order.shoe_brand} {order.shoe_model || ""}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Ukuran & Warna:</span>
                      <span className="text-slate-800 font-medium">
                        {order.shoe_size ? `Size ${order.shoe_size}` : "-"} {order.shoe_color ? `• Warna ${order.shoe_color}` : ""}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="py-1.5">
                        <span className="text-slate-500 block mb-1">Catatan Tambahan:</span>
                        <span className="text-slate-700 italic text-xs bg-purple-50/60 p-2 rounded-lg block border border-purple-100/60">
                          {order.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct WhatsApp CS Button */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <a
                    href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Konfirmasi & Tanya Teknisi via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTracking() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Memuat Modul Pelacakan shoeVive...</p>
          </div>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}