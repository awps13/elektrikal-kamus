import Link from "next/link";
import { requireUser } from "../lib/dal";
import { logout } from "../actions/auth";
import { prisma } from "../lib/db";
import GuruSettings from "./GuruSettings";

function fmtTanggal(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(d);
}

function warnaNilai(p: number) {
  if (p >= 90) return "text-amber-600 bg-amber-50";
  if (p >= 70) return "text-emerald-600 bg-emerald-50";
  if (p >= 50) return "text-sky-600 bg-sky-50";
  return "text-rose-600 bg-rose-50";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const isGuru = user.role === "GURU";

  return (
    <div className="min-h-screen" style={{ background: "#f8f6f0" }}>
      {/* HEADER */}
      <header className="sticky top-0 z-30" style={{ background: "rgba(26,26,46,0.97)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-white font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
            <span className="text-xl">⚡</span> <span>Dashboard <span style={{ color: "#f59e0b" }}>{isGuru ? "Guru" : "Murid"}</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-blue-200">Halo, <strong className="text-white">{user.name}</strong></span>
            <Link href="/modul" className="text-xs font-semibold text-blue-200 hover:text-white border border-white/20 rounded-lg px-3 py-1.5 transition-colors">📘 Modul</Link>
            <form action={logout}>
              <button className="text-xs font-semibold text-rose-200 hover:text-white border border-rose-300/30 rounded-lg px-3 py-1.5 transition-colors">Keluar</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isGuru ? <GuruView /> : <MuridView userId={user.id} name={user.name} />}
      </main>

      <footer className="border-t border-gray-200 py-6 text-center mt-6">
        <p className="text-xs text-gray-400">⚡ <strong className="text-gray-600">E-Modul</strong> — Dashboard</p>
      </footer>
    </div>
  );
}

// ── TAMPILAN GURU ────────────────────────────────────────────────────────────
async function GuruView() {
  const results = await prisma.quizResult.findMany({
    include: { user: { select: { name: true, kelas: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalPengerjaan = results.length;
  const muridUnik = new Set(results.map((r) => r.user.name)).size;
  const rataRata = totalPengerjaan ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / totalPengerjaan) : 0;
  const lulus = results.filter((r) => r.percentage >= 70).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>Hasil Kuis Murid</h1>
        <p className="text-sm text-gray-500">Pantau nilai evaluasi modul yang dikirim oleh murid.</p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Pengerjaan" value={totalPengerjaan} emoji="📝" />
        <StatCard label="Jumlah Murid" value={muridUnik} emoji="🎓" />
        <StatCard label="Rata-rata Nilai" value={`${rataRata}`} emoji="📊" />
        <StatCard label="Lulus (≥70)" value={`${lulus}/${totalPengerjaan}`} emoji="✅" />
      </div>

      {/* Tabel hasil */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>Daftar Nilai</h2>
        </div>
        {totalPengerjaan === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-600 font-semibold">Belum ada hasil kuis</p>
            <p className="text-sm text-gray-400">Hasil akan muncul setelah murid mengerjakan & mengirim kuis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">No</th>
                  <th className="px-5 py-3 font-semibold">Nama Murid</th>
                  <th className="px-5 py-3 font-semibold">Kelas</th>
                  <th className="px-5 py-3 font-semibold">Skor</th>
                  <th className="px-5 py-3 font-semibold">Nilai</th>
                  <th className="px-5 py-3 font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{r.user.name}</td>
                    <td className="px-5 py-3 text-gray-500">{r.user.kelas ?? "-"}</td>
                    <td className="px-5 py-3 text-gray-700">{r.score}/{r.total}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${warnaNilai(r.percentage)}`}>{r.percentage}</span></td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{fmtTanggal(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pengaturan: tambah guru & ganti kata sandi */}
      <GuruSettings />
    </div>
  );
}

// ── TAMPILAN MURID ───────────────────────────────────────────────────────────
async function MuridView({ userId, name }: { userId: string; name: string }) {
  const results = await prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const terbaik = results.length ? Math.max(...results.map((r) => r.percentage)) : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>Halo, {name} 👋</h1>
          <p className="text-sm text-gray-500">Riwayat nilai kuis yang sudah kamu kirim ke guru.</p>
        </div>
        <Link href="/modul" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
          📘 Kerjakan Kuis
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Pengerjaan" value={results.length} emoji="📝" />
        <StatCard label="Nilai Terbaik" value={`${terbaik}`} emoji="🏆" />
        <StatCard label="Status" value={terbaik >= 70 ? "Lulus" : "Belum"} emoji={terbaik >= 70 ? "✅" : "📚"} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>Riwayat Nilai</h2>
        </div>
        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🧠</div>
            <p className="text-gray-600 font-semibold">Belum ada nilai</p>
            <p className="text-sm text-gray-400 mb-4">Kerjakan kuis evaluasi modul untuk mengirim nilai ke guru.</p>
            <Link href="/modul" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>Mulai Kuis →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">No</th>
                  <th className="px-5 py-3 font-semibold">Skor</th>
                  <th className="px-5 py-3 font-semibold">Nilai</th>
                  <th className="px-5 py-3 font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 text-gray-700">{r.score}/{r.total}</td>
                    <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${warnaNilai(r.percentage)}`}>{r.percentage}</span></td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{fmtTanggal(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
