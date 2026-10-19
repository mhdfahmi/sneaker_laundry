import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "shoevive_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

// Semua request ke /api/admin/* otomatis membawa token login.
export const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: { Accept: "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau token tidak valid / kedaluwarsa, paksa kembali ke halaman login.
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      clearToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (first && first.length > 0) return first[0];
    }
    if (data?.message) return data.message;
    if (!error.response) {
      return "Tidak bisa terhubung ke server. Pastikan backend (php artisan serve) sedang berjalan.";
    }
  }
  return fallback;
}

// ---------- Tipe data ----------

export type OrderStatus =
  | "queued"
  | "washing"
  | "repaint"
  | "ready_for_delivery"
  | "completed"
  | "cancelled";

export const STATUS_OPTIONS: { value: OrderStatus; label: string; badge: string }[] = [
  { value: "queued", label: "Antrian Masuk", badge: "bg-slate-100 text-slate-700 border-slate-300" },
  { value: "washing", label: "Sedang Dicuci", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "repaint", label: "Repaint / Treatment", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "ready_for_delivery", label: "Siap Diantar / Diambil", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "completed", label: "Selesai", badge: "bg-green-100 text-green-800 border-green-300" },
  { value: "cancelled", label: "Dibatalkan", badge: "bg-red-100 text-red-800 border-red-300" },
];

export function statusInfo(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
}

export interface ServiceData {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number;
  duration?: string | null;
  material?: string | null;
}

export interface AdminOrder {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shoe_brand?: string | null;
  shoe_model?: string | null;
  shoe_color?: string | null;
  shoe_size?: string | null;
  shoe_details?: string | null;
  notes?: string | null;
  total_price: number;
  status: OrderStatus;
  estimated_ready_at?: string | null;
  created_at: string;
  service?: ServiceData | null;
}

// ---------- Format tampilan ----------

export function formatRupiah(amount?: number | null): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
