"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "../lib/db";
import { createSession, deleteSession } from "../lib/session";
import { MuridSchema, GuruLoginSchema, type FormState } from "../lib/definitions";
import { zodErrors } from "../lib/form";

// ── MASUK MURID (nama lengkap + kelas, tanpa password) ───────────────────────
// Bila nama belum terdaftar → otomatis dibuat. Bila sudah → masuk & perbarui kelas.
export async function masukMurid(_state: FormState, formData: FormData): Promise<FormState> {
  const raw = { name: formData.get("name"), kelas: formData.get("kelas") };
  const parsed = MuridSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: zodErrors(parsed.error),
      values: { name: String(raw.name ?? ""), kelas: String(raw.kelas ?? "") },
    };
  }

  const { name, kelas } = parsed.data;
  const values = { name, kelas };

  try {
    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing && existing.role === "GURU") {
      return { ok: false, errors: { name: ["Nama ini dipakai akun guru. Gunakan nama lain."] }, values };
    }

    let murid = existing;
    if (murid) {
      murid = await prisma.user.update({ where: { id: murid.id }, data: { kelas } });
    } else {
      murid = await prisma.user.create({ data: { name, kelas, role: "MURID" } });
    }

    await createSession({ userId: murid.id, role: "MURID", name: murid.name });
  } catch (err) {
    console.error("masukMurid error", err);
    return { ok: false, message: "Terjadi kesalahan. Coba lagi.", values };
  }

  redirect("/modul");
}

// ── LOGIN GURU (username + password) ─────────────────────────────────────────
export async function loginGuru(_state: FormState, formData: FormData): Promise<FormState> {
  const raw = { username: formData.get("username"), password: formData.get("password") };
  const parsed = GuruLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error), values: { username: String(raw.username ?? "") } };
  }

  const { username, password } = parsed.data;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.role !== "GURU" || !user.password || !(await bcrypt.compare(password, user.password))) {
      return { ok: false, message: "Username atau kata sandi salah.", values: { username } };
    }
    await createSession({ userId: user.id, role: "GURU", name: user.name });
  } catch (err) {
    console.error("loginGuru error", err);
    return { ok: false, message: "Terjadi kesalahan saat masuk. Coba lagi.", values: { username } };
  }

  redirect("/dashboard");
}

// ── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logout() {
  await deleteSession();
  redirect("/login");
}
