"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsappButton() {
  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Admin
  const message = encodeURIComponent(
    "Halo Admin shoeVive! 👋 Saya ingin konsultasi & booking cuci sepatu."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <span className="hidden sm:inline-block bg-white text-slate-800 text-xs font-bold py-1.5 px-3.5 rounded-full shadow-lg border border-purple-100">
        Konsultasi & Order via WA
      </span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin"
        className="relative group bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none"></span>
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
}