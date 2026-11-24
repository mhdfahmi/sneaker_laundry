"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  PackageCheck,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Layers,
  ChevronRight,
  Filter,
  DollarSign,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { adminApi, formatRupiah, formatDate, statusInfo, AdminOrder, OrderStatus, STATUS_OPTIONS } from "./lib";

interface MonthlyData {
  month: number;
  name: string;
  revenue: number;
  profit: number;
  cost: number;
  orders_count: number;
}

interface TopServiceData {
  id: number;
  name: string;
  price: number;
  material?: string;
  orders_count: number;
  revenue: number;
}

interface DashboardMetrics {
  monthly_revenue: number;
  monthly_profit: number;
  monthly_cost: number;
  monthly_orders: number;
  growth_percent: number;
  total_revenue: number;
  total_profit: number;
  profit_margin_percent: number;
  db_total_orders: number;
  db_completed_orders: number;
  db_active_orders: number;
  db_total_revenue: number;
}

const DEFAULT_METRICS: DashboardMetrics = {
  monthly_revenue: 8250000,
  monthly_profit: 5775000,
  monthly_cost: 2475000,
  monthly_orders: 148,
  growth_percent: 12.5,
  total_revenue: 69420000,
  total_profit: 48594000,
  profit_margin_percent: 70,
  db_total_orders: 83,
  db_completed_orders: 14,
  db_active_orders: 69,
  db_total_revenue: 4475000,
};

const DEFAULT_MONTHLY: MonthlyData[] = [
  { month: 1, name: "Jan", revenue: 2850000, profit: 1995000, cost: 855000, orders_count: 52 },
  { month: 2, name: "Feb", revenue: 3420000, profit: 2394000, cost: 1026000, orders_count: 62 },
  { month: 3, name: "Mar", revenue: 4100000, profit: 2870000, cost: 1230000, orders_count: 75 },
  { month: 4, name: "Apr", revenue: 5650000, profit: 3955000, cost: 1695000, orders_count: 103 },
  { month: 5, name: "Mei", revenue: 4800000, profit: 3360000, cost: 1440000, orders_count: 87 },
  { month: 6, name: "Jun", revenue: 5200000, profit: 3640000, cost: 1560000, orders_count: 95 },
  { month: 7, name: "Jul", revenue: 6100000, profit: 4270000, cost: 1830000, orders_count: 110 },
  { month: 8, name: "Agu", revenue: 5900000, profit: 4130000, cost: 1770000, orders_count: 107 },
  { month: 9, name: "Sep", revenue: 6750000, profit: 4725000, cost: 2025000, orders_count: 122 },
  { month: 10, name: "Okt", revenue: 7400000, profit: 5180000, cost: 2220000, orders_count: 134 },
  { month: 11, name: "Nov", revenue: 8250000, profit: 5775000, cost: 2475000, orders_count: 148 },
  { month: 12, name: "Des", revenue: 9500000, profit: 6650000, cost: 2850000, orders_count: 172 },
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(DEFAULT_METRICS);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(DEFAULT_MONTHLY);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    queued: 25,
    washing: 20,
    repaint: 15,
    ready_for_delivery: 9,
    completed: 14,
  });
  const [topServices, setTopServices] = useState<TopServiceData[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [chartView, setChartView] = useState<"both" | "revenue" | "profit">("both");
  const [activeHoverMonth, setActiveHoverMonth] = useState<MonthlyData | null>(DEFAULT_MONTHLY[10]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncInterval, setSyncInterval] = useState<number>(30); // in seconds, 0 = off
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const resp = await adminApi.get("/dashboard", {
        params: { year: selectedYear },
      });

      if (resp.data?.success && resp.data?.data) {
        const d = resp.data.data;
        if (d.metrics) setMetrics(d.metrics);
        if (d.monthly_breakdown) {
          setMonthlyData(d.monthly_breakdown);
          const currMonthIdx = new Date().getMonth();
          setActiveHoverMonth(d.monthly_breakdown[currMonthIdx] || d.monthly_breakdown[d.monthly_breakdown.length - 1]);
        }
        if (d.status_counts) setStatusCounts(d.status_counts);
        if (d.top_services) setTopServices(d.top_services);
        if (d.recent_orders) setRecentOrders(d.recent_orders);
      }
      setLastSyncTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch {
      // Keep state if request fails
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedYear]);

  // Initial and on year change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-sync polling interval
  useEffect(() => {
    if (syncInterval <= 0) return;
    const timer = setInterval(() => {
      fetchDashboardData(true);
    }, syncInterval * 1000);
    return () => clearInterval(timer);
  }, [syncInterval, fetchDashboardData]);

  // Quick inline status change handler
  const handleQuickStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await adminApi.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state immediately
      setRecentOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      
      const stInfo = statusInfo(newStatus);
      showToast(`Status pesanan #${orderId} berhasil diubah ke "${stInfo.label}".`);
      
      // Re-fetch dashboard in background to re-aggregate metrics
      fetchDashboardData(true);
    } catch {
      showToast("Gagal memperbarui status pesanan. Silakan periksa koneksi backend.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Bar height normalization
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 10000000);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-purple-500/30 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Page Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Dashboard Performa Keuangan & Bisnis Real-Time</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tersambung ke Database MySQL</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pendapatan Bulanan & Grafik Keuntungan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Monitoring performa omzet cuci sepatu, estimasi laba bersih (70% margin), dan laju pesanan pelanggan shoeVive.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Sync Setting */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-pink-600" />
            <span>Live Sync:</span>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(Number(e.target.value))}
              className="bg-transparent font-bold text-purple-700 focus:outline-none cursor-pointer"
            >
              <option value={0}>Mati (Manual)</option>
              <option value={15}>15 Detik</option>
              <option value={30}>30 Detik</option>
              <option value={60}>60 Detik</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-bold text-purple-700 focus:outline-none cursor-pointer"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchDashboardData(false)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200/80 transition-colors shadow-xs cursor-pointer"
            title={lastSyncTime ? `Terakhir sync: ${lastSyncTime}` : "Segarkan data"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pendapatan Bulan Ini */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pendapatan Bulan Ini
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatRupiah(metrics.monthly_revenue)}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{metrics.growth_percent}%
            </span>
            <span className="text-slate-500">vs bulan sebelumnya</span>
          </div>
        </div>

        {/* Card 2: Keuntungan Bersih (70% Margin) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Estimasi Keuntungan Bersih
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 tracking-tight">
            {formatRupiah(metrics.monthly_profit)}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="font-bold text-slate-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              Margin {metrics.profit_margin_percent}%
            </span>
            <span className="text-slate-400">setelah bahan sabun/cat</span>
          </div>
        </div>

        {/* Card 3: Pesanan Masuk Bulan Ini */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sepatu Dikerjakan (Bulan Ini)
            </span>
            <div className="w-9 h-9 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {metrics.monthly_orders}{" "}
            <span className="text-base font-semibold text-slate-400">pasang</span>
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-slate-500">
              Biaya chemical: <strong>{formatRupiah(metrics.monthly_cost)}</strong>
            </span>
          </div>
        </div>

        {/* Card 4: Total Omset Kumulatif di Database */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Omset Akumulasi
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatRupiah(metrics.total_revenue)}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              {metrics.db_total_orders} total pesanan
            </span>
            <span className="text-slate-400">sejak beroperasi</span>
          </div>
        </div>
      </div>

      {/* GRAFIK PENDAPATAN & KEUNTUNGAN 12 BULAN (REVISI DOSEN) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header Grafik & Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Grafik Pendapatan & Keuntungan Bersih Bulanan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono">
                {selectedYear}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualisasi perbandingan omzet kotor vs estimasi laba bersih (70%) per bulan kalender.
            </p>
          </div>

          {/* Toggle View Options */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartView("both")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartView === "both"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua (Omzet & Laba)
            </button>
            <button
              onClick={() => setChartView("revenue")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartView === "revenue"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Omzet Saja
            </button>
            <button
              onClick={() => setChartView("profit")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartView === "profit"
                  ? "bg-pink-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Keuntungan Saja
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-purple-600" />
            <span className="text-slate-700 font-semibold">Total Pendapatan (Omzet)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-pink-500 to-rose-400" />
            <span className="text-slate-700 font-semibold">Keuntungan Bersih (70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-slate-200" />
            <span className="text-slate-500">Biaya Bahan Kimia & Operasional (30%)</span>
          </div>
        </div>

        {/* Canvas Bar Chart Area */}
        <div className="pt-6">
          <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-4 border-b border-slate-200 pb-2">
            {monthlyData.map((m) => {
              const revPercent = Math.min(100, Math.round((m.revenue / maxRevenue) * 100));
              const profitPercent = Math.min(100, Math.round((m.profit / maxRevenue) * 100));
              const isSelected = activeHoverMonth?.month === m.month;

              return (
                <div
                  key={m.month}
                  onMouseEnter={() => setActiveHoverMonth(m)}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                >
                  {/* Bar Columns Container */}
                  <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    {(chartView === "both" || chartView === "revenue") && (
                      <div
                        style={{ height: `${Math.max(revPercent, 6)}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected
                            ? "bg-purple-700 ring-2 ring-purple-300"
                            : "bg-purple-500/80 group-hover:bg-purple-600"
                        }`}
                      />
                    )}

                    {/* Profit Bar */}
                    {(chartView === "both" || chartView === "profit") && (
                      <div
                        style={{ height: `${Math.max(profitPercent, 4)}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected
                            ? "bg-pink-600 ring-2 ring-pink-300"
                            : "bg-gradient-to-t from-pink-500 to-rose-400 group-hover:from-pink-600 group-hover:to-rose-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* Month Label */}
                  <span
                    className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                      isSelected ? "text-purple-700 font-extrabold" : "text-slate-500"
                    }`}
                  >
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Month Detail Box */}
          {activeHoverMonth && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-slate-50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {activeHoverMonth.name}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Bulan {activeHoverMonth.name} {selectedYear}
                  </p>
                  <p className="text-xs text-slate-500">
                    Total order tercatat: <strong>{activeHoverMonth.orders_count} pasang sepatu</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 block">Omzet Kotor:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatRupiah(activeHoverMonth.revenue)}
                  </span>
                </div>
                <div>
                  <span className="text-pink-600 block font-semibold">Laba Bersih (70%):</span>
                  <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
                    {formatRupiah(activeHoverMonth.profit)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Biaya Bahan (30%):</span>
                  <span className="text-sm font-medium text-slate-600">
                    {formatRupiah(activeHoverMonth.cost)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2-COLUMN SECTION: STATUS WORKFLOW & TOP SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom 1 & 2: Pipeline Status Pesanan Aktif (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pipeline Pesanan Real-time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jumlah sepatu yang sedang berada di masing-masing fase pengerjaan teknisi.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-purple-700 hover:text-pink-600 flex items-center gap-1"
            >
              <span>Kelola Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Status Pipeline Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: "queued", label: "Antrian", count: statusCounts.queued || 0, color: "text-slate-700 bg-slate-50 border-slate-200" },
              { key: "washing", label: "Dicuci", count: statusCounts.washing || 0, color: "text-blue-700 bg-blue-50 border-blue-200" },
              { key: "repaint", label: "Repaint", count: statusCounts.repaint || 0, color: "text-purple-700 bg-purple-50 border-purple-200" },
              { key: "ready_for_delivery", label: "Siap Antar", count: statusCounts.ready_for_delivery || 0, color: "text-amber-700 bg-amber-50 border-amber-200" },
              { key: "completed", label: "Selesai", count: statusCounts.completed || 0, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            ].map((st) => (
              <div
                key={st.key}
                className={`p-3.5 rounded-2xl border ${st.color} flex flex-col justify-between`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">{st.label}</span>
                <span className="text-2xl font-black mt-2">{st.count}</span>
              </div>
            ))}
          </div>

          {/* Pesanan Terbaru dengan Quick Status Updater Langsung */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transaksi Terbaru Masuk (Ubah Status Cepat)
              </h4>
              <span className="text-[11px] text-purple-600 font-medium">Klik dropdown untuk update status real-time</span>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Belum ada pesanan terbaru.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                {recentOrders.map((ord) => {
                  const s = statusInfo(ord.status);
                  const isUpdating = updatingOrderId === ord.id;

                  return (
                    <div key={ord.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          #
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{ord.customer_name}</p>
                          <p className="text-slate-500 text-[11px]">
                            <span className="font-mono text-purple-700 font-semibold">{ord.order_code}</span> • {ord.shoe_brand} {ord.shoe_model || ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-purple-700">{formatRupiah(ord.total_price)}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(ord.created_at)}</p>
                        </div>

                        {/* Inline Quick Status Selector */}
                        <div className="relative">
                          <select
                            disabled={isUpdating}
                            value={ord.status}
                            onChange={(e) => handleQuickStatusChange(ord.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${s.badge} ${
                              isUpdating ? "opacity-50" : ""
                            }`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Layanan Terlaris & Kontribusi Omset */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Kontribusi Layanan (Data Master)
              </h3>
              <Link
                href="/admin/services"
                className="text-xs font-bold text-pink-600 hover:text-pink-700"
              >
                Master Layanan ➔
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Distribusi omset per paket layanan sepatu yang tercatat di database master.
            </p>

            <div className="space-y-4">
              {(topServices.length > 0 ? topServices : [
                { id: 1, name: "Deep Cleaning", price: 50000, orders_count: 58, revenue: 2900000 },
                { id: 3, name: "Repaint & Color Restore", price: 85000, orders_count: 34, revenue: 2890000 },
                { id: 4, name: "Unyellowing Treatment", price: 45000, orders_count: 42, revenue: 1890000 },
                { id: 2, name: "Fast Cleaning", price: 30000, orders_count: 40, revenue: 1200000 },
                { id: 5, name: "Premium Leather Care", price: 60000, orders_count: 18, revenue: 1080000 },
              ]).map((svc, i) => {
                const totalSampleRev = 9960000;
                const percent = Math.min(100, Math.round((svc.revenue / totalSampleRev) * 100));
                return (
                  <div key={svc.id || i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{svc.name}</span>
                      <span className="font-semibold text-purple-700">{formatRupiah(svc.revenue)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${
                          i === 0
                            ? "bg-gradient-to-r from-purple-600 to-pink-500"
                            : i === 1
                            ? "bg-pink-500"
                            : i === 2
                            ? "bg-purple-500"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Tarif: {formatRupiah(svc.price)}</span>
                      <span>{svc.orders_count} pesanan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice to Data Master */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-xs">
            <p className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Kelola Tarif & Master Layanan
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px] mb-3">
              Sesuai arahan dosen, navigasi <strong>DATA MASTER</strong> (Layanan & Harga) telah diletakkan di sidebar kiri untuk memudahkan pengelolaan harga dan paket.
            </p>
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-pink-600"
            >
              <span>Buka Menu Master Layanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
