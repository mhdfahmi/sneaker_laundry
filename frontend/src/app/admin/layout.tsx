"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Tag,
  LogOut,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  Database,
  Layers,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { adminApi, clearToken, getToken } from "./lib";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  exact?: boolean;
}

interface NavGroup {
  groupName: string;
  icon?: any;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "MENU UTAMA",
    items: [
      { name: "Dashboard & Keuntungan", href: "/admin", icon: LayoutDashboard, exact: true },
      { name: "Kelola Pesanan", href: "/admin/orders", icon: ClipboardList },
    ],
  },
  {
    groupName: "DATA MASTER",
    icon: Database,
    items: [
      { name: "Master Layanan & Harga", href: "/admin/services", icon: Layers },
    ],
  },
  {
    groupName: "PINTASAN",
    items: [
      { name: "Lihat Web Publik", href: "/", icon: ExternalLink },
    ],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Halaman admin hanya boleh dibuka kalau sudah login (ada token).
  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginPage, pathname, router]);

  const handleLogout = async () => {
    try {
      await adminApi.post("/logout");
    } catch {
      // tetap lanjut logout di sisi browser walaupun request gagal
    } finally {
      clearToken();
      router.replace("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Memuat Sistem shoeVive Admin...</span>
        </div>
      </div>
    );
  }

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-purple-950 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-pink-500/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight">
            shoe<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vive</span>{" "}
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-900 text-purple-200">Admin</span>
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* LEFT SIDEBAR (Sidebar di sebelah KIRI) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 z-50 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white block leading-tight">
                  shoe<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vive</span>
                </span>
                <span className="text-[10px] text-pink-300/80 font-bold uppercase tracking-widest block">
                  Management Panel
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Grouped by Dosen's request: Data Master, Layanan di Kiri) */}
          <nav className="p-4 space-y-6 flex-1">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  {group.icon && <group.icon className="w-3.5 h-3.5 text-pink-400" />}
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {group.groupName}
                  </span>
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isLinkActive(item);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/25 font-bold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {active && <ChevronRight className="w-4 h-4 text-white/80" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom User Profile & Logout */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-3 bg-slate-800/50 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-pink-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Admin shoeVive</p>
                <p className="text-[11px] text-slate-400 truncate">admin@gmail.com</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Sesi</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar info */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {pathname === "/admin"
                ? "Dashboard & Grafik Keuntungan"
                : pathname.replace("/admin/", "").replace(/-/g, " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistem API Terkoneksi</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-purple-600 font-semibold"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
