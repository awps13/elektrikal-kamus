"use client";

import Link from "next/link";

type AuthUser = { name: string; role: "GURU" | "MURID" } | null;

export default function HomeClient({ user }: { user: AuthUser }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "#f59e0b", transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10" style={{ background: "#0ea5e9", transform: "translate(-30%,30%)" }} />

      {/* AUTH NAV */}
      <div className="relative max-w-4xl w-full mx-auto px-4 pt-6 flex justify-end items-center gap-2">
        {user ? (
          <>
            <span className="hidden sm:inline text-xs text-blue-200">Halo, <strong className="text-white">{user.name}</strong> · {user.role === "GURU" ? "Guru" : "Murid"}</span>
            <Link href="/dashboard" className="text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/20 transition-colors">
              {user.role === "GURU" ? "📊 Dashboard Guru" : "📊 Dashboard"}
            </Link>
          </>
        ) : (
          <Link href="/login" className="text-xs font-semibold text-gray-900 rounded-lg px-4 py-1.5 transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>Masuk</Link>
        )}
      </div>

      {/* HERO — judul + tombol start */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 text-amber-300 border border-amber-500/30 bg-amber-500/10">
          ⚡ E-Modul Instalasi Listrik Rumah
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
          E-Modul <span style={{ color: "#f59e0b" }}>Instalasi Listrik</span>
        </h1>
        <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Panduan lengkap &amp; visual untuk memahami instalasi listrik rumah — dari komponen, teknik, hingga keselamatan kerja.
        </p>
        <Link
          href={user ? "/kamus" : "/login"}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 shadow-lg"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
        >
          🚀 Mulai
        </Link>
      </div>

      <footer className="relative py-6 text-center">
        <p className="text-xs text-blue-300/70">Referensi: PUIL 2011 · SNI 04-0225-2011 · Standar PLN</p>
      </footer>
    </div>
  );
}
