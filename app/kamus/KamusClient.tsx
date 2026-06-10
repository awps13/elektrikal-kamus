"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { items, soalKuis, kategoriInfo, type Kategori, type Item } from "../data/konten";
import { logout } from "../actions/auth";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function KamusCard({ item, search, onClick }: { item: Item; search: string; onClick: () => void }) {
  const info = kategoriInfo[item.kategori];
  return (
    <button
      onClick={onClick}
      className={`card-hover w-full text-left bg-white rounded-2xl border ${info.border} p-5 shadow-sm cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${info.warna}`}>{info.label}</div>
          <h3
            className="font-bold text-gray-900 leading-snug mb-2"
            style={{ fontFamily: "Sora, sans-serif" }}
            dangerouslySetInnerHTML={{ __html: highlight(item.nama, search) }}
          />
          <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: highlight(item.deskripsi, search) }} />
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${info.bg} ${info.warna} font-medium`}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function DetailModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const info = kategoriInfo[item.kategori];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${info.bg} ${info.warna}`}>
            {info.emoji} {info.label}
          </span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="text-5xl mb-3">{item.emoji}</div>
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug" style={{ fontFamily: "Sora, sans-serif" }}>{item.nama}</h2>
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl ${info.bg} border ${info.border}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${info.warna}`}>📝 Deskripsi</div>
            <p className="text-sm text-gray-700 leading-relaxed">{item.deskripsi}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">⚙️ Fungsi</div>
            <p className="text-sm text-gray-700 leading-relaxed">{item.fungsi}</p>
          </div>
          {item.tips && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-amber-600">💡 Tips Praktis</div>
              <p className="text-sm text-gray-700 leading-relaxed">{item.tips}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className={`text-xs px-2.5 py-1 rounded-full ${info.bg} ${info.warna} font-medium border ${info.border}`}>#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KuisSection() {
  const [current, setCurrent] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState<boolean[]>([]);

  const soal = soalKuis[current];
  const kat = soal.kategori as Kategori;
  const info = kategoriInfo[kat] ?? { label: "Umum", warna: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", emoji: "❓", deskripsi: "" };

  function pilihJawaban(idx: number) {
    if (dipilih !== null) return;
    setDipilih(idx);
    if (idx === soal.jawabanBenar) setSkor((s) => s + 1);
  }

  function lanjut() {
    setRiwayat((r) => [...r, dipilih === soal.jawabanBenar]);
    setDipilih(null);
    if (current + 1 >= soalKuis.length) setSelesai(true);
    else setCurrent((c) => c + 1);
  }

  function reset() {
    setCurrent(0); setDipilih(null); setSkor(0); setSelesai(false); setRiwayat([]);
  }

  const persen = Math.round((skor / soalKuis.length) * 100);

  if (selesai) {
    const level = persen >= 90 ? { label: "Master Listrik! 🏆", color: "text-amber-600", bg: "bg-amber-50" }
      : persen >= 70 ? { label: "Teknisi Handal! 💪", color: "text-emerald-600", bg: "bg-emerald-50" }
      : persen >= 50 ? { label: "Perlu Belajar Lagi 📚", color: "text-sky-600", bg: "bg-sky-50" }
      : { label: "Ayo Coba Lagi! 🔌", color: "text-rose-600", bg: "bg-rose-50" };

    return (
      <div className="text-center animate-in">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>Kuis Selesai!</h3>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 ${level.bg} ${level.color}`}>{level.label}</div>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ fontFamily: "Sora, sans-serif" }}>{skor}<span className="text-xl text-gray-400">/{soalKuis.length}</span></div>
            <div className="text-sm text-gray-500">Jawaban Benar</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-extrabold text-amber-500" style={{ fontFamily: "Sora, sans-serif" }}>{persen}%</div>
            <div className="text-sm text-gray-500">Skor Akhir</div>
          </div>
        </div>
        <div className="flex gap-2 justify-center mb-6">
          {riwayat.map((benar, i) => (
            <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${benar ? "bg-emerald-500 text-white" : "bg-rose-400 text-white"}`}>
              {benar ? "✓" : "✗"}
            </div>
          ))}
        </div>
        <button onClick={reset} className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
          Coba Lagi 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(current / soalKuis.length) * 100}%`, background: "linear-gradient(90deg,#f59e0b,#10b981)" }} />
        </div>
        <span className="text-sm font-bold text-gray-500">{current + 1}/{soalKuis.length}</span>
      </div>
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${info.bg} ${info.warna} border ${info.border}`}>
        {info.emoji} {info.label}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed" style={{ fontFamily: "Sora, sans-serif" }}>{soal.pertanyaan}</h3>
      <div className="space-y-3 mb-6">
        {soal.pilihan.map((p, i) => {
          let cls = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300";
          if (dipilih !== null) {
            if (i === soal.jawabanBenar) cls = "bg-emerald-50 border-emerald-400 text-emerald-800";
            else if (i === dipilih) cls = "bg-rose-50 border-rose-400 text-rose-800";
            else cls = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
          }
          return (
            <button key={i} onClick={() => pilihJawaban(i)} disabled={dipilih !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}>
              <span className="font-bold mr-2">{["A","B","C","D"][i]}.</span>{p}
              {dipilih !== null && i === soal.jawabanBenar && <span className="float-right">✅</span>}
              {dipilih !== null && i === dipilih && i !== soal.jawabanBenar && <span className="float-right">❌</span>}
            </button>
          );
        })}
      </div>
      {dipilih !== null && (
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 mb-4 animate-in">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">💡 Penjelasan</div>
          <p className="text-sm text-gray-700">{soal.penjelasan}</p>
        </div>
      )}
      {dipilih !== null && (
        <button onClick={lanjut} className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] text-sm" style={{ background: "linear-gradient(135deg,#1a1a2e,#374151)" }}>
          {current + 1 >= soalKuis.length ? "Lihat Hasil 🏁" : "Soal Berikutnya →"}
        </button>
      )}
    </div>
  );
}

type Tab = "semua" | Kategori | "kuis";

type AuthUser = { name: string; role: "GURU" | "MURID" } | null;

export default function KamusClient({ user }: { user: AuthUser }) {
  const [tab, setTab] = useState<Tab>("semua");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchKat = tab === "semua" || tab === "kuis" || item.kategori === tab;
      const matchSearch = !q || item.nama.toLowerCase().includes(q) || item.deskripsi.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q));
      return matchKat && matchSearch;
    });
  }, [tab, search]);

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: "semua", label: "Semua", emoji: "📚" },
    { key: "komponen", label: "Komponen", emoji: "⚡" },
    { key: "alat-bahan", label: "Alat & Bahan", emoji: "🔧" },
    { key: "teknik", label: "Teknik", emoji: "🔌" },
    { key: "k3", label: "K3", emoji: "🦺" },
    { key: "kuis", label: "Kuis", emoji: "🧠" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f8f6f0" }}>
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#f59e0b", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "#0ea5e9", transform: "translate(-30%,30%)" }} />

        {/* AUTH NAV */}
        <div className="relative max-w-4xl mx-auto px-4 flex justify-end items-center gap-2 mb-6">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-blue-200">Halo, <strong className="text-white">{user.name}</strong> · {user.role === "GURU" ? "Guru" : "Murid"}</span>
              <Link href="/dashboard" className="text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/20 transition-colors">
                {user.role === "GURU" ? "📊 Dashboard Guru" : "📊 Dashboard"}
              </Link>
              <form action={logout}>
                <button className="text-xs font-semibold text-rose-200 hover:text-white border border-rose-300/30 rounded-lg px-3 py-1.5 transition-colors">Keluar</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-xs font-semibold text-gray-900 rounded-lg px-4 py-1.5 transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>Masuk</Link>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 text-amber-300 border border-amber-500/30 bg-amber-500/10">
            ⚡ E-Modul Instalasi Listrik Rumah
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
            E-Modul
          </h1>
          <p className="text-blue-200 text-lg mb-6 max-w-xl mx-auto leading-relaxed">
            Panduan lengkap &amp; visual untuk memahami instalasi listrik rumah — dari komponen, teknik, hingga keselamatan kerja.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <Link href="/modul" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              📘 Buka Modul Pembelajaran
            </Link>
            <a href="#kamus" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-blue-100 border border-white/20 hover:bg-white/10 transition-colors">
              🔍 Jelajahi E-Modul
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { n: items.filter(i=>i.kategori==="komponen").length, label: "Komponen" },
              { n: items.filter(i=>i.kategori==="alat-bahan").length, label: "Alat & Bahan" },
              { n: items.filter(i=>i.kategori==="teknik").length, label: "Teknik" },
              { n: items.filter(i=>i.kategori==="k3").length, label: "K3" },
              { n: soalKuis.length, label: "Soal Kuis" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Sora, sans-serif" }}>{s.n}</div>
                <div className="text-xs text-blue-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH + TABS */}
      <div id="kamus" className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 scroll-mt-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3 px-4 py-3 mb-4">
          <span className="text-xl">🔍</span>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari komponen, alat, teknik, atau K3..."
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none"
          />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>}
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "text-white shadow-md scale-105" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
              style={tab === t.key ? { background: t.key === "kuis" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "linear-gradient(135deg,#1a1a2e,#374151)" } : {}}>
              {t.emoji} {t.label}
              {t.key !== "kuis" && t.key !== "semua" && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-gray-100"}`}>
                  {items.filter(i=>i.kategori===t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {tab === "kuis" ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto animate-in">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>🧠</div>
              <div>
                <h2 className="font-bold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>Uji Pengetahuanmu</h2>
                <p className="text-xs text-gray-500">{soalKuis.length} soal pilihan ganda · Semua kategori</p>
              </div>
            </div>
            <KuisSection />
          </div>
        ) : (
          <>
            {tab !== "semua" && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl mb-5 border ${kategoriInfo[tab as Kategori].border} ${kategoriInfo[tab as Kategori].bg}`}>
                <span className="text-2xl">{kategoriInfo[tab as Kategori].emoji}</span>
                <div>
                  <h2 className={`font-bold ${kategoriInfo[tab as Kategori].warna}`} style={{ fontFamily: "Sora, sans-serif" }}>{kategoriInfo[tab as Kategori].label}</h2>
                  <p className="text-xs text-gray-500">{kategoriInfo[tab as Kategori].deskripsi}</p>
                </div>
              </div>
            )}
            {search && <p className="text-sm text-gray-500 mb-4">Menemukan <strong>{filtered.length}</strong> hasil untuk &quot;<strong>{search}</strong>&quot;</p>}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-gray-600 mb-1">Tidak ditemukan</h3>
                <p className="text-sm text-gray-400">Coba kata kunci yang berbeda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in">
                {filtered.map((item) => (
                  <KamusCard key={item.id} item={item} search={search} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="border-t border-gray-200 py-6 text-center">
        <p className="text-xs text-gray-400">⚡ <strong className="text-gray-600">E-Modul Instalasi Listrik</strong> — Panduan Visual untuk Rumah</p>
        <p className="text-xs text-gray-400 mt-1">Referensi: PUIL 2011 · SNI 04-0225-2011 · Standar PLN</p>
      </footer>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
