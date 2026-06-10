"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { masukMurid, loginGuru } from "../actions/auth";

type Mode = "murid" | "guru";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("murid");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 text-white font-extrabold text-2xl mb-6" style={{ fontFamily: "Sora, sans-serif" }}>
          <span>⚡</span> E-Modul <span style={{ color: "#f59e0b" }}>Instalasi Listrik</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-7">
          {/* Tab pilih peran */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button onClick={() => setMode("murid")}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${mode === "murid" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
              🎓 Murid
            </button>
            <button onClick={() => setMode("guru")}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${mode === "guru" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
              👨‍🏫 Guru
            </button>
          </div>

          {mode === "murid" ? <MuridForm /> : <GuruForm />}
        </div>

        <p className="text-center text-xs text-blue-200/70 mt-5">
          <Link href="/" className="hover:text-white">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  );
}

// ── Form Murid: Nama + Kelas ─────────────────────────────────────────────────
function MuridForm() {
  const [state, action, pending] = useActionState(masukMurid, undefined);
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Sora, sans-serif" }}>Masuk sebagai Murid</h1>
      <p className="text-sm text-gray-500 mb-6">Cukup isi nama lengkap dan kelasmu untuk mulai mengerjakan kuis.</p>

      {state?.message && <Alert text={state.message} />}

      <form action={action} className="space-y-4">
        <Field label="Nama Lengkap" name="name" placeholder="cth: Budi Santoso" defaultValue={state?.values?.name} errors={state?.errors?.name} hint="Gunakan nama lengkap yang sama setiap kali masuk." />
        <Field label="Kelas" name="kelas" placeholder="cth: XI DPIB 1" defaultValue={state?.values?.kelas} errors={state?.errors?.kelas} />
        <button disabled={pending} type="submit"
          className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
          {pending ? "Memproses…" : "Masuk & Mulai →"}
        </button>
      </form>
    </>
  );
}

// ── Form Guru: Username + Password ───────────────────────────────────────────
function GuruForm() {
  const [state, action, pending] = useActionState(loginGuru, undefined);
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Sora, sans-serif" }}>Masuk sebagai Guru</h1>
      <p className="text-sm text-gray-500 mb-6">Gunakan username dan kata sandi guru untuk melihat hasil kuis murid.</p>

      {state?.message && <Alert text={state.message} />}

      <form action={action} className="space-y-4">
        <Field label="Username" name="username" placeholder="username guru" defaultValue={state?.values?.username} errors={state?.errors?.username} />
        <Field label="Kata Sandi" name="password" type="password" placeholder="••••••••" errors={state?.errors?.password} />
        <button disabled={pending} type="submit"
          className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#374151)" }}>
          {pending ? "Memproses…" : "Masuk →"}
        </button>
      </form>
    </>
  );
}

function Alert({ text }: { text: string }) {
  return <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{text}</div>;
}

function Field({ label, name, type = "text", placeholder, defaultValue, errors, hint }: {
  label: string; name: string; type?: string; placeholder?: string; defaultValue?: string; errors?: string[]; hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {errors?.map((e) => <p key={e} className="text-xs text-rose-600 mt-1">{e}</p>)}
    </div>
  );
}
