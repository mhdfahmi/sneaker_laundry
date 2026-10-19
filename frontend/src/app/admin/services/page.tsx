"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  adminApi,
  API_URL,
  formatRupiah,
  getErrorMessage,
  ServiceData,
} from "../lib";

interface FormState {
  name: string;
  price: string;
  duration: string;
  material: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  price: "",
  duration: "",
  material: "",
  description: "",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal tambah / edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceData | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const fetchServices = useCallback(async () => {
    setError("");
    try {
      const resp = await axios.get(`${API_URL}/api/services`);
      setServices(resp.data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Gagal memuat daftar layanan."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (service: ServiceData) => {
    setEditing(service);
    setForm({
      name: service.name,
      price: String(service.price),
      duration: service.duration ?? "",
      material: service.material ?? "",
      description: service.description ?? "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      duration: form.duration.trim() || null,
      material: form.material.trim() || null,
      description: form.description.trim() || null,
    };

    try {
      if (editing) {
        await adminApi.put(`/services/${editing.id}`, payload);
        showNotice("success", `Layanan "${payload.name}" berhasil diperbarui.`);
      } else {
        await adminApi.post("/services", payload);
        showNotice("success", `Layanan "${payload.name}" berhasil ditambahkan.`);
      }
      setModalOpen(false);
      await fetchServices();
    } catch (err) {
      setFormError(getErrorMessage(err, "Gagal menyimpan layanan."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: ServiceData) => {
    const ok = window.confirm(`Hapus layanan "${service.name}"?`);
    if (!ok) return;

    try {
      await adminApi.delete(`/services/${service.id}`);
      showNotice("success", `Layanan "${service.name}" berhasil dihapus.`);
      await fetchServices();
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Gagal menghapus layanan."));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Layanan & Harga</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola paket cuci yang tampil di halaman pelanggan. Perubahan harga tidak
            mengubah pesanan yang sudah masuk.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-md shadow-pink-500/20 hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </button>
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

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Harga</th>
                <th className="px-4 py-3 font-semibold">Durasi</th>
                <th className="px-4 py-3 font-semibold">Bahan</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading && services.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Belum ada layanan.
                  </td>
                </tr>
              )}

              {!loading &&
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/60 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{service.name}</div>
                      {service.description && (
                        <div className="text-xs text-slate-500 mt-0.5 max-w-md line-clamp-2">
                          {service.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">
                      {formatRupiah(service.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {service.duration || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{service.material || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(service)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                          aria-label={`Edit ${service.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          aria-label={`Hapus ${service.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tambah / edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama layanan
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    placeholder="contoh: 2-3 Hari"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bahan sepatu
                  </label>
                  <input
                    type="text"
                    placeholder="contoh: Canvas, Suede"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              {formError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
