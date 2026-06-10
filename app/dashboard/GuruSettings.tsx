"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addGuru, changePassword } from "../actions/guru";
import type { FormState } from "../lib/definitions";

export default function GuruSettings() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "Sora, sans-serif" }}>
          ⚙️ Pengaturan Guru
        </span>
        <span className="text-gray-400 text-sm">{open ? "Tutup ▲" : "Buka ▼"}</span>
      </button>

      {open && (
        <div className="grid md:grid-cols-2 gap-4 mt-4 animate-in">
          <AddGuruForm />
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}

function Banner({ state }: { state: FormState }) {
  if (!state?.message) return null;
  const ok = state.ok;
  return (
    <div className={`mb-4 p-3 rounded-xl border text-sm ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
      {ok ? "✅ " : "⚠️ "}{state.message}
    </div>
  );
}

function Input({ label, name, type = "text", placeholder, defaultValue, errors }: {
  label: string; name: string; type?: string; placeholder?: string; defaultValue?: string; errors?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
      {errors?.map((e) => <p key={e} className="text-xs text-rose-600 mt-1">{e}</p>)}
    </div>
  );
}

// ── Tambah akun guru ─────────────────────────────────────────────────────────
function AddGuruForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(addGuru, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2" style={{ fontFamily: "Sora, sans-serif" }}>👨‍🏫 Tambah Akun Guru</h3>
      <p className="text-xs text-gray-500 mb-4">Buat akun untuk guru lain.</p>
      <Banner state={state} />
      <form ref={formRef} action={action} className="space-y-3">
        <Input label="Nama" name="name" placeholder="Nama guru" defaultValue={state?.ok ? "" : state?.values?.name} errors={state?.errors?.name} />
        <Input label="Username" name="username" placeholder="username login" defaultValue={state?.ok ? "" : state?.values?.username} errors={state?.errors?.username} />
        <Input label="Kata Sandi" name="password" type="password" placeholder="Minimal 6 karakter" errors={state?.errors?.password} />
        <button disabled={pending} type="submit"
          className="w-full py-2.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#374151)" }}>
          {pending ? "Menyimpan…" : "Tambah Guru"}
        </button>
      </form>
    </div>
  );
}

// ── Ganti kata sandi ─────────────────────────────────────────────────────────
function ChangePasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2" style={{ fontFamily: "Sora, sans-serif" }}>🔑 Ganti Kata Sandi</h3>
      <p className="text-xs text-gray-500 mb-4">Ubah kata sandi akun Anda.</p>
      <Banner state={state} />
      <form ref={formRef} action={action} className="space-y-3">
        <Input label="Kata Sandi Saat Ini" name="currentPassword" type="password" placeholder="••••••••" errors={state?.errors?.currentPassword} />
        <Input label="Kata Sandi Baru" name="newPassword" type="password" placeholder="Minimal 6 karakter" errors={state?.errors?.newPassword} />
        <Input label="Konfirmasi Kata Sandi Baru" name="confirmPassword" type="password" placeholder="Ulangi kata sandi baru" errors={state?.errors?.confirmPassword} />
        <button disabled={pending} type="submit"
          className="w-full py-2.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
          {pending ? "Menyimpan…" : "Simpan Kata Sandi"}
        </button>
      </form>
    </div>
  );
}
