"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { babList, soalEvaluasi, type Bab, type Blok } from "../data/modul";
import { submitQuizResult } from "../actions/quiz";
import { logout } from "../actions/auth";

type AuthUser = { name: string; role: "GURU" | "MURID" } | null;

// ════════════════════════════════════════════════════════════════════════════
// SIMBOL KELISTRIKAN (SVG) — gaya baku PUIL/IEC
// ════════════════════════════════════════════════════════════════════════════
const S = "#1a1a2e"; // warna garis simbol

function SymbolFrame({
  children,
  nama,
  ket,
}: {
  children: ReactNode;
  nama: string;
  ket: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center text-center shadow-sm">
      <div className="h-20 w-full flex items-center justify-center mb-2">
        <svg
          viewBox="0 0 80 60"
          className="h-16 w-auto"
          stroke={S}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {children}
        </svg>
      </div>
      <div
        className="text-sm font-bold text-gray-900"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {nama}
      </div>
      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{ket}</div>
    </div>
  );
}

const SIMBOLS: { nama: string; ket: string; svg: ReactNode }[] = [
  {
    nama: "Lampu",
    ket: "Titik penerangan / lampu",
    svg: (
      <>
        <circle cx="40" cy="30" r="14" />
        <line x1="30" y1="20" x2="50" y2="40" />
        <line x1="50" y1="20" x2="30" y2="40" />
        <line x1="8" y1="30" x2="26" y2="30" />
        <line x1="54" y1="30" x2="72" y2="30" />
      </>
    ),
  },
  {
    nama: "Saklar Tunggal",
    ket: "Memutus/menyambung 1 lampu",
    svg: (
      <>
        <line x1="10" y1="40" x2="34" y2="40" />
        <line x1="34" y1="40" x2="52" y2="22" />
        <line x1="52" y1="40" x2="70" y2="40" />
        <circle cx="34" cy="40" r="2.5" fill={S} />
      </>
    ),
  },
  {
    nama: "Saklar Seri",
    ket: "Mengontrol 2 lampu",
    svg: (
      <>
        <line x1="8" y1="42" x2="30" y2="42" />
        <line x1="30" y1="42" x2="46" y2="24" />
        <line x1="46" y1="24" x2="60" y2="24" />
        <line x1="46" y1="24" x2="60" y2="40" />
        <circle cx="30" cy="42" r="2.5" fill={S} />
      </>
    ),
  },
  {
    nama: "Saklar Tukar",
    ket: "Kontrol 1 lampu dari 2 tempat",
    svg: (
      <>
        <line x1="8" y1="40" x2="30" y2="40" />
        <line x1="30" y1="40" x2="52" y2="22" />
        <line x1="52" y1="22" x2="72" y2="22" />
        <line x1="52" y1="40" x2="72" y2="40" />
        <circle cx="30" cy="40" r="2.5" fill={S} />
      </>
    ),
  },
  {
    nama: "Stop Kontak",
    ket: "Outlet / kotak kontak",
    svg: (
      <>
        <path d="M22 38 a18 18 0 0 1 36 0" />
        <line x1="22" y1="38" x2="58" y2="38" />
        <line x1="40" y1="38" x2="40" y2="52" />
      </>
    ),
  },
  {
    nama: "Stop Kontak Arde",
    ket: "Outlet dengan pembumian",
    svg: (
      <>
        <path d="M22 36 a18 18 0 0 1 36 0" />
        <line x1="22" y1="36" x2="58" y2="36" />
        <line x1="40" y1="36" x2="40" y2="52" />
        <line x1="20" y1="22" x2="26" y2="28" />
        <line x1="60" y1="22" x2="54" y2="28" />
      </>
    ),
  },
  {
    nama: "MCB",
    ket: "Pengaman arus otomatis",
    svg: (
      <>
        <rect x="26" y="14" width="28" height="32" rx="2" />
        <line x1="40" y1="6" x2="40" y2="14" />
        <line x1="40" y1="46" x2="40" y2="54" />
        <line x1="33" y1="22" x2="47" y2="38" />
      </>
    ),
  },
  {
    nama: "Sekring (Fuse)",
    ket: "Pengaman lebur",
    svg: (
      <>
        <rect x="24" y="22" width="32" height="16" rx="2" />
        <line x1="8" y1="30" x2="24" y2="30" />
        <line x1="56" y1="30" x2="72" y2="30" />
        <line x1="24" y1="30" x2="56" y2="30" />
      </>
    ),
  },
  {
    nama: "PHB / Panel",
    ket: "Kotak hubung bagi",
    svg: (
      <>
        <rect x="18" y="14" width="44" height="32" rx="2" />
        <line x1="18" y1="24" x2="62" y2="24" />
        <circle cx="28" cy="35" r="3" />
        <circle cx="40" cy="35" r="3" />
        <circle cx="52" cy="35" r="3" />
      </>
    ),
  },
  {
    nama: "Pembumian (Arde)",
    ket: "Grounding ke tanah",
    svg: (
      <>
        <line x1="40" y1="12" x2="40" y2="30" />
        <line x1="24" y1="30" x2="56" y2="30" />
        <line x1="29" y1="37" x2="51" y2="37" />
        <line x1="34" y1="44" x2="46" y2="44" />
      </>
    ),
  },
  {
    nama: "kWh Meter",
    ket: "Meteran energi PLN",
    svg: (
      <>
        <circle cx="40" cy="30" r="16" />
        <text
          x="40"
          y="34"
          fontSize="10"
          fill={S}
          stroke="none"
          textAnchor="middle"
          fontWeight="bold"
        >
          kWh
        </text>
      </>
    ),
  },
  {
    nama: "Kotak Sambung",
    ket: "Percabangan kabel",
    svg: (
      <>
        <line x1="14" y1="30" x2="66" y2="30" />
        <line x1="40" y1="30" x2="40" y2="52" />
        <circle cx="40" cy="30" r="3.5" fill={S} />
      </>
    ),
  },
];

function GaleriSimbol() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
      {SIMBOLS.map((s) => (
        <SymbolFrame key={s.nama} nama={s.nama} ket={s.ket}>
          {s.svg}
        </SymbolFrame>
      ))}
    </div>
  );
}

// Kartu komponen: foto real di samping nama & penjelasan.
// File foto disimpan di public/komponen/<ikon>.jpg
function KomponenList({
  items,
}: {
  items: { ikon: string; nama: string; teks: string; gambar?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
      {items.map((it) => (
        <div
          key={it.nama}
          className="rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3 shadow-sm"
        >
          <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={it.gambar ?? `/komponen/${it.ikon}.jpg`}
              alt={it.nama}
              width={160}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {it.nama}
            </div>
            <div className="text-xs text-gray-600 mt-0.5 leading-snug">
              {it.teks}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Video YouTube tertanam — bisa ditonton di web atau dibuka di YouTube.
function VideoYoutube({ id, judul }: { id: string; judul?: string }) {
  return (
    <figure className="my-3">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={judul ?? "Video pembelajaran"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <figcaption className="text-xs text-gray-500 mt-2 flex flex-wrap items-center gap-2">
        <span>🎬 {judul ?? "Video pembelajaran"}</span>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-600 font-semibold hover:underline"
        >
          Tonton di YouTube ↗
        </a>
      </figcaption>
    </figure>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ALAT PELINDUNG DIRI (APD) — gambar infografik
// ════════════════════════════════════════════════════════════════════════════
function GaleriAPD() {
  return (
    <figure className="my-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm flex justify-center">
        <Image
          src="/apd.jpeg"
          alt="Alat Pelindung Diri (APD) teknisi listrik: helm safety, faceshield, arc flash suit, sarung tangan, dan sepatu safety."
          width={1080}
          height={1080}
          className="w-full max-w-sm h-auto rounded-lg"
        />
      </div>
      <figcaption className="text-xs text-gray-500 text-center mt-2">
        Alat Pelindung Diri (APD) untuk teknisi listrik
      </figcaption>
    </figure>
  );
}

// ── Diagram pengawatan rumah sederhana (SVG) ─────────────────────────────────
function DiagramRumah() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 my-2 overflow-x-auto shadow-sm">
      <svg
        viewBox="0 0 520 260"
        className="w-full min-w-[480px]"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {/* PLN */}
        <text x="20" y="30" fontSize="11" fontWeight="700" fill="#1a1a2e">
          PLN
        </text>
        <line
          x1="20"
          y1="40"
          x2="20"
          y2="120"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        {/* kWh meter */}
        <circle cx="20" cy="120" r="2.5" fill="#1a1a2e" />
        <rect
          x="55"
          y="95"
          width="60"
          height="50"
          rx="6"
          fill="#fef3c7"
          stroke="#d97706"
          strokeWidth="2"
        />
        <text
          x="85"
          y="125"
          fontSize="11"
          fontWeight="700"
          fill="#92400e"
          textAnchor="middle"
        >
          kWh
        </text>
        <line
          x1="20"
          y1="120"
          x2="55"
          y2="120"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        {/* Box panel + MCB */}
        <rect
          x="150"
          y="80"
          width="80"
          height="80"
          rx="6"
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="2"
        />
        <text
          x="190"
          y="98"
          fontSize="10"
          fontWeight="700"
          fill="#334155"
          textAnchor="middle"
        >
          BOX PANEL
        </text>
        <rect
          x="165"
          y="108"
          width="20"
          height="34"
          rx="3"
          fill="#fff"
          stroke="#1a1a2e"
          strokeWidth="1.6"
        />
        <rect
          x="195"
          y="108"
          width="20"
          height="34"
          rx="3"
          fill="#fff"
          stroke="#1a1a2e"
          strokeWidth="1.6"
        />
        <text x="175" y="155" fontSize="8" fill="#334155" textAnchor="middle">
          MCB1
        </text>
        <text x="205" y="155" fontSize="8" fill="#334155" textAnchor="middle">
          MCB2
        </text>
        <line
          x1="115"
          y1="120"
          x2="150"
          y2="120"
          stroke="#1a1a2e"
          strokeWidth="2"
        />

        {/* Grup 1: saklar -> lampu */}
        <line
          x1="185"
          y1="108"
          x2="185"
          y2="60"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <line
          x1="185"
          y1="60"
          x2="320"
          y2="60"
          stroke="#dc2626"
          strokeWidth="2"
        />
        {/* saklar */}
        <line
          x1="320"
          y1="60"
          x2="345"
          y2="48"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <circle cx="320" cy="60" r="2.5" fill="#1a1a2e" />
        <line
          x1="345"
          y1="60"
          x2="400"
          y2="60"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <text x="332" y="40" fontSize="9" fill="#334155" textAnchor="middle">
          saklar
        </text>
        {/* lampu */}
        <circle
          cx="415"
          cy="60"
          r="15"
          fill="#fffbeb"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <line
          x1="405"
          y1="50"
          x2="425"
          y2="70"
          stroke="#1a1a2e"
          strokeWidth="1.6"
        />
        <line
          x1="425"
          y1="50"
          x2="405"
          y2="70"
          stroke="#1a1a2e"
          strokeWidth="1.6"
        />
        <line x1="400" y1="60" x2="400" y2="60" />
        <text x="415" y="92" fontSize="9" fill="#334155" textAnchor="middle">
          Lampu
        </text>

        {/* Grup 2: stop kontak */}
        <line
          x1="205"
          y1="142"
          x2="205"
          y2="200"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <line
          x1="205"
          y1="200"
          x2="380"
          y2="200"
          stroke="#dc2626"
          strokeWidth="2"
        />
        {/* netral & arde */}
        <line
          x1="205"
          y1="215"
          x2="380"
          y2="215"
          stroke="#2563eb"
          strokeWidth="2"
        />
        <line
          x1="205"
          y1="230"
          x2="380"
          y2="230"
          stroke="#16a34a"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
        <path
          d="M390 192 a18 18 0 0 1 0 46"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <line
          x1="380"
          y1="200"
          x2="392"
          y2="200"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <line
          x1="380"
          y1="215"
          x2="392"
          y2="215"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <line
          x1="380"
          y1="230"
          x2="392"
          y2="230"
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <text x="430" y="218" fontSize="9" fill="#334155" textAnchor="middle">
          Stop
        </text>
        <text x="430" y="229" fontSize="9" fill="#334155" textAnchor="middle">
          kontak
        </text>

        {/* legenda */}
        <line
          x1="20"
          y1="245"
          x2="45"
          y2="245"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <text x="50" y="249" fontSize="9" fill="#334155">
          Fasa (L)
        </text>
        <line
          x1="120"
          y1="245"
          x2="145"
          y2="245"
          stroke="#2563eb"
          strokeWidth="2"
        />
        <text x="150" y="249" fontSize="9" fill="#334155">
          Netral (N)
        </text>
        <line
          x1="225"
          y1="245"
          x2="250"
          y2="245"
          stroke="#16a34a"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
        <text x="255" y="249" fontSize="9" fill="#334155">
          Arde (PE)
        </text>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RENDER BLOK KONTEN
// ════════════════════════════════════════════════════════════════════════════
const INFO_STYLE: Record<
  string,
  { bg: string; border: string; text: string; emoji: string }
> = {
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    emoji: "ℹ️",
  },
  bahaya: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    emoji: "⚠️",
  },
  tips: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    emoji: "💡",
  },
  catatan: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    emoji: "📌",
  },
};

function RenderBlok({ blok }: { blok: Blok }) {
  switch (blok.tipe) {
    case "paragraf":
      return (
        <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
          {blok.teks}
        </p>
      );
    case "subjudul":
      return (
        <h3
          className="text-lg font-bold text-gray-900 mt-7 mb-3"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {blok.teks}
        </h3>
      );
    case "poin":
      return (
        <div className="mb-4">
          {blok.judul && (
            <p className="text-[15px] font-semibold text-gray-800 mb-2">
              {blok.judul}
            </p>
          )}
          <ul className="space-y-2">
            {blok.items.map((it, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[15px] text-gray-700 leading-relaxed"
              >
                <span className="text-amber-500 mt-1 shrink-0">●</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "langkah":
      return (
        <ol className="space-y-2.5 mb-4">
          {blok.items.map((it, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] text-gray-700 leading-relaxed"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
    case "info": {
      const st = INFO_STYLE[blok.varian];
      return (
        <div className={`p-4 rounded-2xl border ${st.bg} ${st.border} mb-4`}>
          <div
            className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${st.text}`}
          >
            {st.emoji} {blok.judul}
          </div>
          <p className="text-[14px] text-gray-700 leading-relaxed">
            {blok.teks}
          </p>
        </div>
      );
    }
    case "tabel":
      return (
        <div className="overflow-x-auto mb-5 rounded-2xl border border-gray-200">
          <table className="w-full text-left text-[14px] border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white">
                {blok.kolom.map((k) => (
                  <th
                    key={k}
                    className="px-4 py-2.5 font-semibold whitespace-nowrap"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blok.baris.map((row, ri) => (
                <tr key={ri} className={ri % 2 ? "bg-gray-50" : "bg-white"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 text-gray-700 align-top ${ci === 0 ? "font-medium text-gray-900" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "simbol":
      return <GaleriSimbol />;
    case "diagram":
      return <DiagramRumah />;
    case "apd":
      return <GaleriAPD />;
    case "komponen-list":
      return <KomponenList items={blok.items} />;
    case "video":
      return <VideoYoutube id={blok.youtube} judul={blok.judul} />;
    default:
      return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// KUIS EVALUASI — 15 soal, tampilkan jawaban benar saat salah
// ════════════════════════════════════════════════════════════════════════════
function Evaluasi({ user }: { user: AuthUser }) {
  const [current, setCurrent] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState<boolean[]>([]);
  const [kirim, setKirim] = useState<{
    status: "idle" | "loading" | "done" | "error";
    pesan: string;
  }>({ status: "idle", pesan: "" });

  async function kirimHasil() {
    setKirim({ status: "loading", pesan: "" });
    const res = await submitQuizResult({
      score: skor,
      total: soalEvaluasi.length,
    });
    setKirim({ status: res.ok ? "done" : "error", pesan: res.message });
  }

  const soal = soalEvaluasi[current];
  const benar = dipilih === soal.jawabanBenar;

  function pilih(idx: number) {
    if (dipilih !== null) return;
    setDipilih(idx);
    if (idx === soal.jawabanBenar) setSkor((s) => s + 1);
  }
  function lanjut() {
    setRiwayat((r) => [...r, benar]);
    setDipilih(null);
    if (current + 1 >= soalEvaluasi.length) setSelesai(true);
    else setCurrent((c) => c + 1);
  }
  function reset() {
    setCurrent(0);
    setDipilih(null);
    setSkor(0);
    setSelesai(false);
    setRiwayat([]);
    setKirim({ status: "idle", pesan: "" });
  }

  const persen = Math.round((skor / soalEvaluasi.length) * 100);

  if (selesai) {
    const lulus = persen >= 70;
    const level =
      persen >= 90
        ? {
            l: "Sangat Baik — Master Listrik! 🏆",
            c: "text-amber-600",
            b: "bg-amber-50",
          }
        : persen >= 70
          ? {
              l: "Baik — Kamu Lulus! 💪",
              c: "text-emerald-600",
              b: "bg-emerald-50",
            }
          : persen >= 50
            ? {
                l: "Cukup — Pelajari Lagi 📚",
                c: "text-sky-600",
                b: "bg-sky-50",
              }
            : {
                l: "Perlu Belajar Lagi 🔌",
                c: "text-rose-600",
                b: "bg-rose-50",
              };
    return (
      <div className="text-center animate-in">
        <div className="text-6xl mb-4">{lulus ? "🎉" : "📚"}</div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Evaluasi Selesai!
        </h3>
        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 ${level.b} ${level.c}`}
        >
          {level.l}
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div>
            <div
              className="text-4xl font-extrabold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {skor}
              <span className="text-xl text-gray-400">
                /{soalEvaluasi.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">Benar</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <div
              className="text-4xl font-extrabold text-amber-500"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {persen}%
            </div>
            <div className="text-sm text-gray-500">Nilai</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-md mx-auto">
          {riwayat.map((b, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${b ? "bg-emerald-500 text-white" : "bg-rose-400 text-white"}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* Kirim hasil ke dashboard guru */}
        <div className="max-w-md mx-auto mb-6">
          {!user ? (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sm">
              <p className="text-gray-700 mb-3">
                Masuk sebagai <strong>murid</strong> (nama + kelas) untuk
                mengirim nilai ini ke dashboard guru.
              </p>
              <div className="flex gap-2 justify-center">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  }}
                >
                  Masuk sebagai Murid
                </Link>
              </div>
            </div>
          ) : user.role !== "MURID" ? (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-600">
              Anda masuk sebagai <strong>guru</strong>. Pengiriman nilai hanya
              untuk akun murid.
            </div>
          ) : kirim.status === "done" ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-semibold">
              {kirim.pesan}{" "}
              <Link href="/dashboard" className="underline">
                Lihat riwayat →
              </Link>
            </div>
          ) : (
            <div>
              <button
                onClick={kirimHasil}
                disabled={kirim.status === "loading"}
                className="w-full px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                }}
              >
                {kirim.status === "loading"
                  ? "Mengirim…"
                  : "📤 Kirim Nilai ke Guru"}
              </button>
              {kirim.status === "error" && (
                <p className="text-xs text-rose-600 mt-2">{kirim.pesan}</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
        >
          Ulangi Evaluasi 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(current / soalEvaluasi.length) * 100}%`,
              background: "linear-gradient(90deg,#f59e0b,#10b981)",
            }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{soalEvaluasi.length}
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 bg-violet-50 text-violet-700 border border-violet-200">
        📘 Materi Bab {soal.bab}
      </div>
      <h3
        className="text-lg font-bold text-gray-900 mb-6 leading-relaxed"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {soal.pertanyaan}
      </h3>
      <div className="space-y-3 mb-5">
        {soal.pilihan.map((p, i) => {
          let cls =
            "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300";
          if (dipilih !== null) {
            if (i === soal.jawabanBenar)
              cls = "bg-emerald-50 border-emerald-400 text-emerald-800";
            else if (i === dipilih)
              cls = "bg-rose-50 border-rose-400 text-rose-800";
            else cls = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => pilih(i)}
              disabled={dipilih !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}
            >
              <span className="font-bold mr-2">{["A", "B", "C", "D"][i]}.</span>
              {p}
              {dipilih !== null && i === soal.jawabanBenar && (
                <span className="float-right">✅</span>
              )}
              {dipilih !== null && i === dipilih && i !== soal.jawabanBenar && (
                <span className="float-right">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Umpan balik: tampilkan jawaban benar saat salah */}
      {dipilih !== null && (
        <div
          className={`p-4 rounded-xl border mb-4 animate-in ${benar ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
        >
          <div
            className={`text-sm font-bold mb-1 ${benar ? "text-emerald-700" : "text-rose-700"}`}
          >
            {benar ? "✅ Jawaban Benar!" : "❌ Jawaban Salah"}
          </div>
          {!benar && (
            <p className="text-sm text-gray-800 mb-1.5">
              Jawaban yang benar:{" "}
              <strong className="text-emerald-700">
                {["A", "B", "C", "D"][soal.jawabanBenar]}.{" "}
                {soal.pilihan[soal.jawabanBenar]}
              </strong>
            </p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed">
            💡 {soal.penjelasan}
          </p>
        </div>
      )}

      {dipilih !== null && (
        <button
          onClick={lanjut}
          className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] text-sm"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#374151)" }}
        >
          {current + 1 >= soalEvaluasi.length
            ? "Lihat Hasil Akhir 🏁"
            : "Soal Berikutnya →"}
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// HALAMAN MODUL
// ════════════════════════════════════════════════════════════════════════════
type View = "cover" | { babIndex: number } | "evaluasi";

export default function ModulClient({ user }: { user: AuthUser }) {
  const [view, setView] = useState<View>("cover");
  const [dibaca, setDibaca] = useState<Set<string>>(new Set());
  const [menuProfil, setMenuProfil] = useState(false);

  const babIndex = typeof view === "object" ? view.babIndex : -1;
  const babAktif: Bab | null = babIndex >= 0 ? babList[babIndex] : null;

  const totalLangkah = babList.length + 1; // bab + evaluasi
  const progress = useMemo(
    () => Math.round((dibaca.size / totalLangkah) * 100),
    [dibaca, totalLangkah],
  );

  function bukaBab(i: number) {
    setView({ babIndex: i });
    setDibaca((s) => new Set(s).add(babList[i].id));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function bukaEvaluasi() {
    setView("evaluasi");
    setDibaca((s) => new Set(s).add("evaluasi"));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function bukaCover() {
    setView("cover");
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8f6f0" }}>
      {/* HEADER */}
      <header
        className="sticky top-0 z-30 backdrop-blur"
        style={{ background: "rgba(26,26,46,0.95)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={bukaCover}
            className="flex items-center gap-2 text-white font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            <span className="text-xl">⚡</span>
            <span>
              E-Modul <span style={{ color: "#f59e0b" }}>Instalasi Listrik</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#f59e0b,#10b981)",
                  }}
                />
              </div>
              <span className="text-xs text-blue-200 font-semibold">
                {progress}%
              </span>
            </div>
            {/* DESKTOP — tombol penuh */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                  <form action={logout}>
                    <button className="text-xs font-semibold text-rose-200 hover:text-white border border-rose-300/30 rounded-lg px-3 py-1.5 transition-colors">
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-900 rounded-lg px-3 py-1.5 transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  }}
                >
                  Masuk
                </Link>
              )}
            </div>

            {/* MOBILE — ikon profil + dropdown */}
            <div className="sm:hidden relative">
              {user ? (
                <>
                  <button
                    onClick={() => setMenuProfil((v) => !v)}
                    aria-label="Menu profil"
                    aria-expanded={menuProfil}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-gray-900 transition-transform hover:scale-105"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  {menuProfil && (
                    <>
                      <button
                        aria-hidden
                        tabIndex={-1}
                        onClick={() => setMenuProfil(false)}
                        className="fixed inset-0 z-40 cursor-default"
                      />
                      <div className="absolute right-0 mt-2 w-52 z-50 rounded-xl overflow-hidden bg-white shadow-xl border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-bold text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.role === "GURU" ? "Guru" : "Murid"}
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuProfil(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          📊 Dashboard
                        </Link>
                        <form action={logout}>
                          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left">
                            🚪 Keluar
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-900 rounded-lg px-3 py-1.5 transition-all hover:scale-105 inline-block"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  }}
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 md:flex md:gap-6">
        {/* SIDEBAR DAFTAR ISI */}
        <aside className="md:w-64 md:shrink-0 mb-6 md:mb-0">
          <div className="md:sticky md:top-20 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 py-1.5">
              Daftar Isi
            </div>
            <button
              onClick={bukaCover}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${view === "cover" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span>🏠</span> Home
            </button>
            {babList.map((b, i) => {
              const aktif = babIndex === i;
              const sudah = dibaca.has(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => bukaBab(i)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${aktif ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <span>{b.ikon}</span>
                  <span className="flex-1 min-w-0">
                    Bab {b.no}. {b.judul}
                  </span>
                  {sudah && !aktif && (
                    <span className="text-emerald-500 text-xs">✓</span>
                  )}
                </button>
              );
            })}
            <button
              onClick={bukaEvaluasi}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 mt-1 ${view === "evaluasi" ? "text-white" : "text-violet-700 hover:bg-violet-50"}`}
              style={
                view === "evaluasi"
                  ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }
                  : {}
              }
            >
              <span>🧠</span> Evaluasi (15 Soal)
            </button>
          </div>
        </aside>

        {/* KONTEN */}
        <main className="flex-1 min-w-0">
          {/* COVER / PENDAHULUAN */}
          {view === "cover" && (
            <div className="animate-in">
              <div
                className="relative overflow-hidden rounded-3xl p-8 md:p-10 mb-6 text-center"
                style={{
                  background:
                    "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                  style={{
                    background: "#f59e0b",
                    transform: "translate(30%,-30%)",
                  }}
                />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 text-amber-300 border border-amber-500/30 bg-amber-500/10">
                  📘 Modul Pembelajaran
                </div>
                <h1
                  className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Instalasi Listrik Rumah
                </h1>
                <p className="text-blue-200 max-w-xl mx-auto leading-relaxed">
                  Modul lengkap dari pengertian, K3, komponen, simbol & gambar,
                  teknik pemasangan, hingga alat & bahan — dilengkapi evaluasi
                  15 soal.
                </p>
              </div>

              {/* Tujuan umum */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h2
                  className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  🎯 Tujuan Pembelajaran Umum
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Setelah mempelajari modul ini, peserta diharapkan mampu
                  memahami konsep instalasi listrik rumah, menerapkan prinsip
                  K3, mengenali komponen serta simbol kelistrikan, membaca
                  diagram pengawatan, serta memahami teknik, alat, dan bahan
                  pemasangan instalasi yang aman sesuai PUIL 2011.
                </p>
              </div>

              {/* Daftar bab kartu */}
              <h2
                className="text-lg font-bold text-gray-900 mb-3"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                📚 Materi Modul
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {babList.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => bukaBab(i)}
                    className="card-hover text-left bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{b.ikon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                          Bab {b.no} · {b.estimasiMenit} menit
                        </div>
                        <h3
                          className="font-bold text-gray-900 leading-snug mb-1"
                          style={{ fontFamily: "Sora, sans-serif" }}
                        >
                          {b.judul}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {b.ringkasan}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => bukaBab(0)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                }}
              >
                Mulai Belajar — Bab 1 →
              </button>
            </div>
          )}

          {/* ISI BAB */}
          {babAktif && (
            <article className="animate-in">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                  <span>Bab {babAktif.no}</span>
                  <span className="text-gray-300">·</span>
                  <span>⏱ {babAktif.estimasiMenit} menit</span>
                </div>
                <h1
                  className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight flex items-center gap-3"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  <span className="text-3xl">{babAktif.ikon}</span>{" "}
                  {babAktif.judul}
                </h1>

                {/* Tujuan bab */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                    🎯 Tujuan Pembelajaran
                  </div>
                  <ul className="space-y-1.5">
                    {babAktif.tujuan.map((t, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-gray-700 leading-relaxed"
                      >
                        <span className="text-amber-500">→</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Konten */}
                {babAktif.blok.map((b, i) => (
                  <RenderBlok key={i} blok={b} />
                ))}
              </div>

              {/* Navigasi prev/next */}
              <div className="flex items-center justify-between gap-3 mt-5">
                {babIndex > 0 ? (
                  <button
                    onClick={() => bukaBab(babIndex - 1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Bab {babList[babIndex - 1].no}
                  </button>
                ) : (
                  <div />
                )}
                {babIndex < babList.length - 1 ? (
                  <button
                    onClick={() => bukaBab(babIndex + 1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#1a1a2e,#374151)",
                    }}
                  >
                    Bab {babList[babIndex + 1].no}.{" "}
                    {babList[babIndex + 1].judul} →
                  </button>
                ) : (
                  <button
                    onClick={bukaEvaluasi}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    }}
                  >
                    Lanjut ke Evaluasi 🧠 →
                  </button>
                )}
              </div>
            </article>
          )}

          {/* EVALUASI */}
          {view === "evaluasi" && (
            <div className="animate-in">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm max-w-2xl">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    }}
                  >
                    🧠
                  </div>
                  <div>
                    <h2
                      className="font-bold text-gray-900 text-lg"
                      style={{ fontFamily: "Sora, sans-serif" }}
                    >
                      Evaluasi Akhir Modul
                    </h2>
                    <p className="text-xs text-gray-500">
                      15 soal pilihan ganda · jawaban benar ditampilkan bila
                      salah · nilai lulus ≥ 70
                    </p>
                  </div>
                </div>
                <Evaluasi user={user} />
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-gray-200 py-6 text-center mt-6">
        <p className="text-xs text-gray-400">
          ⚡ <strong className="text-gray-600">E-Modul Instalasi Listrik</strong> —
          untuk Rumah Tinggal
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Referensi: PUIL 2011 (SNI 0225:2011) · Standar PLN
        </p>
      </footer>
    </div>
  );
}
