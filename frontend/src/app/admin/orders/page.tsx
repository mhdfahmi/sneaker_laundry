"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import {
  adminApi,
  AdminOrder,
  formatDate,
  formatRupiah,
  getErrorMessage,
  OrderStatus,
  STATUS_OPTIONS,
  statusInfo,
} from "../lib";

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });
  const [counts, setCounts] = useState<Record<string, number>>({});

  const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [detail, setDetail] = useState<AdminOrder | null>(null);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const resp = await adminApi.get("/orders", {
          params: {
            page,
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(search ? { search } : {}),
          },
        });
        setOrders(resp.data.data);
        setMeta(resp.data.meta);
        setCounts(resp.data.counts ?? {});
      } catch (err) {
        setError(getErrorMessage(err, "Gagal memuat daftar pesanan."));
      } finally {
        setLoading(false);
      }
    },
    [page, statusFilter, search]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleFilter = (value: "" | OrderStatus) => {
    setPage(1);
    setStatusFilter(value);
  };

  const handleStatusChange = async (order: AdminOrder, newStatus: OrderStatus) => {
    if (newStatus === order.status) return;

    if (newStatus === "cancelled") {
      const ok = window.confirm(`Batalkan pesanan ${order.order_code}?`);
      if (!ok) return;
    }

    setUpdatingId(order.id);
    try {
      await adminApi.patch(`/orders/${order.id}/status`, { status: newStatus });
      showNotice(
        "success",
        `Status ${order.order_code} diubah menjadi "${statusInfo(newStatus).label}".`
      );
      await fetchOrders(true);
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Gagal mengubah status."));
    } finally {
      setUpdatingId(null);
    }
  };

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Daftar Pesanan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lihat semua pesanan dan ubah status pengerjaan sepatu.
        </p>
      </div>

      {notice && (
        <div
          className={`mb-4 text-sm rounded-lg px-4 py-2.5 border ${
            notice.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Filter status */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFilter("")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            statusFilter === ""
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
          }`}
        >
          Semua ({totalAll})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => handleFilter(s.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              statusFilter === s.value
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
            }`}
          >
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
      </div>

      {/* Pencarian */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari kode, nama, atau nomor HP"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-100"
          >
            Reset
          </button>
        )}
      </form>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Kode</th>
                <th className="px-4 py-3 font-semibold">Pelanggan</th>
                <th className="px-4 py-3 font-semibold">Layanan</th>
                <th className="px-4 py-3 font-semibold">Sepatu</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Dipesan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    Tidak ada pesanan yang cocok.
                  </td>
                </tr>
              )}

              {!loading &&
                orders.map((order) => {
                  const info = statusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 align-top">
                      <td className="px-4 py-3 font-mono text-xs text-slate-800 whitespace-nowrap">
                        {order.order_code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{order.customer_name}</div>
                        <div className="text-xs text-slate-500">{order.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{order.service?.name ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {[order.shoe_brand, order.shoe_model].filter(Boolean).join(" ") || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-800">
                        {formatRupiah(order.total_price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order, e.target.value as OrderStatus)
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${info.badge}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDetail(order)}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 whitespace-nowrap"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-600">
          <span>
            {meta.total} pesanan · halaman {meta.current_page} dari {meta.last_page}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Sebelumnya
            </button>
            <button
              disabled={page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal detail */}
      {detail && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-xs text-slate-500">{detail.order_code}</div>
                <h2 className="text-lg font-bold text-slate-900">Detail Pesanan</h2>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                ["Status", statusInfo(detail.status).label],
                ["Pelanggan", detail.customer_name],
                ["No. HP", detail.customer_phone],
                ["Email", detail.customer_email || "-"],
                ["Layanan", detail.service?.name ?? "-"],
                ["Merek / Model", [detail.shoe_brand, detail.shoe_model].filter(Boolean).join(" ") || "-"],
                ["Warna", detail.shoe_color || "-"],
                ["Ukuran", detail.shoe_size || "-"],
                ["Kondisi sepatu", detail.shoe_details || "-"],
                ["Catatan", detail.notes || "-"],
                ["Total", formatRupiah(detail.total_price)],
                ["Estimasi selesai", formatDate(detail.estimated_ready_at)],
                ["Dipesan", formatDate(detail.created_at)],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-3">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="col-span-2 text-slate-900 break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
