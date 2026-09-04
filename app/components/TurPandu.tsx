"use client";

// ════════════════════════════════════════════════════════════════════════════
// TUR PANDU — navigasi step-by-step bergaya "spotlight" khusus murid.
//
// Cara kerja: tiap langkah menunjuk satu elemen di halaman lewat CSS selector
// (`[data-tur="..."]`). Elemen itu disorot dengan lubang terang di tengah
// layar gelap, lalu kartu penjelasan muncul menempel di dekatnya.
//
// Catatan teknis:
// • Semua overlay dirender lewat portal ke <body> supaya `position: fixed`
//   tidak "terkurung" oleh parent yang punya CSS transform (mis. .card-hover).
// • Posisi lubang dihitung ulang tiap frame (requestAnimationFrame) agar tetap
//   menempel saat halaman di-scroll — termasuk saat scroll masih beranimasi.
//   State hanya di-set bila posisinya benar-benar berubah, jadi tidak boros
//   render.
// • Langkah boleh mengubah tampilan halaman dulu lewat `sebelumTampil`
//   (mis. membuka Bab 1), lalu komponen menunggu elemennya muncul di DOM.
// ════════════════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LangkahTur = {
  /** CSS selector elemen yang disorot, mis. `[data-tur="daftar-isi"]`. */
  target: string;
  judul: string;
  teks: string;
  emoji?: string;
  /** Dijalankan sebelum langkah tampil — untuk mengubah tampilan halaman. */
  sebelumTampil?: () => void;
  /** Bila target tidak ada (mis. tersembunyi di layar kecil), langkah dilewati. */
  opsional?: boolean;
};

type Kotak = { top: number; left: number; width: number; height: number };
type Layar = { w: number; h: number };

const PAD = 8; // jarak lubang sorotan dari tepi elemen
const JEDA_WAJIB = 1500; // ms menunggu target langkah wajib muncul
const JEDA_OPSIONAL = 500; // ms menunggu target langkah opsional

// ── Hook pemicu tur ─────────────────────────────────────────────────────────
// Muncul otomatis sekali saja; statusnya disimpan di localStorage browser.
export function useTur(storageKey: string, aktif: boolean) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!aktif) return;
    // localStorage hanya boleh disentuh di browser (efek), bukan saat render,
    // supaya tidak terjadi hydration mismatch.
    let sudah = true;
    try {
      sudah = window.localStorage.getItem(storageKey) === "1";
    } catch {
      sudah = true; // mode privat / storage diblokir → jangan ganggu murid
    }
    if (sudah) return;
    const t = setTimeout(() => setOpen(true), 700); // beri jeda agar layout siap
    return () => clearTimeout(t);
  }, [aktif, storageKey]);

  const mulai = useCallback(() => setOpen(true), []);

  const tutup = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      /* diabaikan */
    }
  }, [storageKey]);

  return { open, mulai, tutup };
}

// ── Komponen tur ────────────────────────────────────────────────────────────
export default function TurPandu({
  langkah,
  open,
  onTutup,
  label = "Panduan Belajar",
}: {
  langkah: LangkahTur[];
  open: boolean;
  /** Dipanggil saat tur selesai maupun dilewati. */
  onTutup: () => void;
  label?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [kotak, setKotak] = useState<Kotak | null>(null);
  const [layar, setLayar] = useState<Layar>({ w: 0, h: 0 });
  const [tinggiKartu, setTinggiKartu] = useState(190);
  const kartuRef = useRef<HTMLDivElement>(null);

  // Semua nilai yang berubah identitasnya tiap render (array `langkah`,
  // callback `onTutup` milik parent, indeks aktif) disimpan di ref.
  //
  // Ini BUKAN sekadar optimasi: kalau `onTutup` ikut jadi dependency efek,
  // maka parent yang mendefinisikan `onTutup` sebagai fungsi biasa (identitas
  // baru tiap render) membuat efek pencari target jalan ulang terus-menerus.
  // Efek itu memanggil `sebelumTampil()` yang mengubah state parent, yang
  // memicu render baru, yang memicu efek lagi → "Maximum update depth
  // exceeded". Dengan ref, `lanjut`/`mundur`/`tutup` stabil selamanya dan efek
  // hanya bergantung pada [open, idx].
  //
  // Ref di-sync lewat efek (bukan saat render) dan sengaja dideklarasikan
  // paling awal agar sudah terisi sebelum efek-efek di bawahnya berjalan.
  const langkahRef = useRef(langkah);
  const idxRef = useRef(0);
  const onTutupRef = useRef(onTutup);
  const total = langkah.length;

  useEffect(() => {
    langkahRef.current = langkah;
    idxRef.current = idx;
    onTutupRef.current = onTutup;
  });

  // Reset ke langkah pertama tiap kali tur dibuka. Pola resmi React untuk
  // menyesuaikan state saat prop berubah — tanpa efek, jadi tidak ada render
  // berantai.
  const [openSebelumnya, setOpenSebelumnya] = useState(open);
  if (open !== openSebelumnya) {
    setOpenSebelumnya(open);
    if (open) {
      setIdx(0);
      setEl(null);
      setKotak(null);
    }
  }

  // PENTING: ketiga callback di bawah HARUS tetap tanpa dependency (baca
  // catatan di atas). Semua nilai yang berubah dibaca lewat ref.
  const tutup = useCallback(() => onTutupRef.current(), []);

  const lanjut = useCallback(() => {
    const i = idxRef.current;
    if (i + 1 >= langkahRef.current.length) {
      onTutupRef.current();
      return;
    }
    setEl(null);
    setIdx(i + 1);
  }, []);

  const mundur = useCallback(() => {
    const i = idxRef.current;
    if (i === 0) return;
    setEl(null);
    setIdx(i - 1);
  }, []);

  // Jalankan `sebelumTampil`, lalu tunggu elemen target muncul & terukur.
  useEffect(() => {
    if (!open) return;
    const step = langkahRef.current[idx];
    if (!step) return;

    step.sebelumTampil?.();

    let batal = false;
    let raf = 0;
    const batas =
      performance.now() + (step.opsional ? JEDA_OPSIONAL : JEDA_WAJIB);

    const cari = () => {
      if (batal) return;
      const found = document.querySelector<HTMLElement>(step.target);
      const r = found?.getBoundingClientRect();
      if (found && r && r.width > 0 && r.height > 0) {
        setEl(found);
        // Elemen pendek ditaruh di tengah layar; elemen panjang (mis. seluruh
        // isi bab) ditaruh dengan bagian atasnya tepat di bawah header.
        const vh = window.innerHeight;
        const y =
          window.scrollY +
          r.top -
          (r.height > vh * 0.5 ? 90 : Math.max(12, (vh - r.height) / 2));
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        return;
      }
      if (performance.now() < batas) {
        raf = requestAnimationFrame(cari);
        return;
      }
      // Target tidak ketemu: langkah opsional dilewati, yang wajib tetap
      // tampil dengan kartu di tengah layar.
      if (step.opsional) lanjut();
      else setEl(null);
    };

    raf = requestAnimationFrame(cari);
    return () => {
      batal = true;
      cancelAnimationFrame(raf);
    };
  }, [open, idx, lanjut]);

  // Ikuti posisi elemen tiap frame (scroll, resize, animasi layout).
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      const r = el?.getBoundingClientRect();
      setKotak((prev) => {
        if (!r) return prev === null ? prev : null;
        // Blok yang lebih tinggi dari layar (mis. seluruh isi bab) hanya
        // disorot bagian atasnya. Kalau tidak dibatasi, "lubang" sorotan jadi
        // lebih besar dari layar sehingga efek gelapnya hilang sama sekali dan
        // kartu penjelasan tidak kebagian tempat.
        const vh = window.innerHeight;
        const maksTinggi = Math.max(200, vh * 0.5);
        let atasKotak = r.top;
        let tinggiKotak = r.height;
        if (tinggiKotak > maksTinggi) {
          atasKotak = Math.max(r.top, 80); // jangan tertutup header sticky
          tinggiKotak = Math.min(maksTinggi, r.bottom - atasKotak);
        }
        if (
          prev &&
          Math.abs(prev.top - atasKotak) < 0.5 &&
          Math.abs(prev.left - r.left) < 0.5 &&
          Math.abs(prev.width - r.width) < 0.5 &&
          Math.abs(prev.height - tinggiKotak) < 0.5
        ) {
          return prev;
        }
        return {
          top: atasKotak,
          left: r.left,
          width: r.width,
          height: tinggiKotak,
        };
      });
      setLayar((prev) =>
        prev.w === window.innerWidth && prev.h === window.innerHeight
          ? prev
          : { w: window.innerWidth, h: window.innerHeight },
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, el]);

  // Tinggi kartu dipakai untuk memutuskan kartu tampil di atas atau di bawah
  // sorotan. Diukur lewat ResizeObserver agar ikut menyesuaikan saat teks
  // langkah berganti atau layar diputar.
  useEffect(() => {
    if (!open) return;
    const node = kartuRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => setTinggiKartu(node.offsetHeight));
    ro.observe(node);
    return () => ro.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
      else if (e.key === "ArrowRight") lanjut();
      else if (e.key === "ArrowLeft") mundur();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, tutup, lanjut, mundur]);

  // `open` hanya bisa bernilai true dari efek/klik di browser, jadi saat blok
  // di bawah ini dirender, `document` dijamin sudah ada (aman dari hydration
  // mismatch).
  if (!open || total === 0) return null;

  const step = langkah[Math.min(idx, total - 1)];
  const terakhir = idx >= total - 1;

  // ── Hitung posisi kartu penjelasan ────────────────────────────────────────
  const W = Math.max(240, Math.min(360, layar.w - 32));
  let kiri = layar.w / 2 - W / 2;
  let atas = layar.h / 2 - tinggiKartu / 2;
  let panah: "atas" | "bawah" | null = null;

  if (kotak) {
    kiri = Math.min(
      Math.max(kotak.left + kotak.width / 2 - W / 2, 16),
      Math.max(16, layar.w - W - 16),
    );
    const ruangBawah = layar.h - (kotak.top + kotak.height);
    if (ruangBawah > tinggiKartu + 40) {
      atas = kotak.top + kotak.height + PAD + 14;
      panah = "atas";
    } else if (kotak.top > tinggiKartu + 40) {
      atas = kotak.top - PAD - 14 - tinggiKartu;
      panah = "bawah";
    } else {
      atas = layar.h - tinggiKartu - 16; // tidak muat di mana pun → tempel bawah
    }
  }
  atas = Math.min(
    Math.max(atas, 12),
    Math.max(12, layar.h - tinggiKartu - 12),
  );

  const panahKiri = kotak
    ? Math.min(Math.max(kotak.left + kotak.width / 2 - kiri, 24), W - 24)
    : W / 2;

  return createPortal(
    <div aria-live="polite">
      {/* Penahan klik — selama tur, halaman di belakang tidak bisa diklik. */}
      <div className="fixed inset-0" style={{ zIndex: 190 }} />

      {/* Sorotan: lubang terang di tengah layar gelap (pakai box-shadow raksasa) */}
      {kotak ? (
        <div
          className="fixed rounded-2xl pointer-events-none"
          style={{
            zIndex: 195,
            top: kotak.top - PAD,
            left: kotak.left - PAD,
            width: kotak.width + PAD * 2,
            height: kotak.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(10,12,26,0.72)",
            border: "2px solid #f59e0b",
            transition: "top .18s ease, left .18s ease, width .18s ease, height .18s ease",
          }}
        />
      ) : (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 195, background: "rgba(10,12,26,0.72)" }}
        />
      )}

      {/* Kartu penjelasan */}
      <div
        ref={kartuRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} — langkah ${idx + 1} dari ${total}`}
        className="fixed rounded-2xl bg-white shadow-2xl animate-in"
        style={{ zIndex: 200, top: atas, left: kiri, width: W }}
      >
        {panah && (
          <span
            className="absolute w-3 h-3 bg-white rotate-45"
            style={{
              left: panahKiri - 6,
              top: panah === "atas" ? -6 : undefined,
              bottom: panah === "bawah" ? -6 : undefined,
            }}
          />
        )}

        <div className="relative p-5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-amber-700 bg-amber-50 border border-amber-200"
            >
              {label} · {idx + 1}/{total}
            </span>
            <button
              onClick={tutup}
              className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
            >
              Lewati
            </button>
          </div>

          <h3
            className="text-base font-bold text-gray-900 leading-snug mb-1.5"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {step.emoji ? `${step.emoji} ` : ""}
            {step.judul}
          </h3>
          <p className="text-[13.5px] text-gray-600 leading-relaxed">{step.teks}</p>

          {/* Titik progres */}
          <div className="flex items-center gap-1.5 mt-4 mb-3">
            {langkah.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 18 : 6,
                  background: i === idx ? "#f59e0b" : i < idx ? "#fcd34d" : "#e5e7eb",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {idx > 0 && (
              <button
                onClick={mundur}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ←
              </button>
            )}
            <button
              onClick={terakhir ? tutup : lanjut}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              style={{
                background: terakhir
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#f59e0b,#d97706)",
              }}
            >
              {terakhir ? "Selesai, mulai belajar ✓" : "Lanjut →"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Tombol kecil untuk memutar ulang tur kapan saja.
export function TombolPanduan({
  onClick,
  gaya = "gelap",
}: {
  onClick: () => void;
  gaya?: "gelap" | "terang";
}) {
  return (
    <button
      onClick={onClick}
      title="Putar ulang panduan langkah demi langkah"
      className={
        gaya === "gelap"
          ? "text-xs font-semibold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-lg px-3 py-1.5 transition-colors"
          : "text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-1.5 transition-colors"
      }
    >
      ❓ Panduan
    </button>
  );
}
