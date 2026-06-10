"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";
import { verifySession } from "../lib/dal";
import { AddGuruSchema, ChangePasswordSchema, type FormState } from "../lib/definitions";
import { zodErrors } from "../lib/form";

// ── Tambah akun guru (hanya guru) ────────────────────────────────────────────
export async function addGuru(_state: FormState, formData: FormData): Promise<FormState> {
  const session = await verifySession();
  if (!session || session.role !== "GURU") {
    return { ok: false, message: "Tidak diizinkan." };
  }

  const raw = {
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const parsed = AddGuruSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: zodErrors(parsed.error),
      values: { name: String(raw.name ?? ""), username: String(raw.username ?? "") },
    };
  }

  const { name, username, password } = parsed.data;
  const values = { name, username };
  try {
    if (await prisma.user.findUnique({ where: { username } })) {
      return { ok: false, errors: { username: ["Username sudah dipakai."] }, values };
    }
    if (await prisma.user.findUnique({ where: { name } })) {
      return { ok: false, errors: { name: ["Nama sudah dipakai."] }, values };
    }
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, username, password: hashed, role: "GURU" } });
    return { ok: true, message: `Akun guru "${name}" berhasil dibuat.` };
  } catch (err) {
    console.error("addGuru error", err);
    return { ok: false, message: "Gagal membuat akun guru. Coba lagi." };
  }
}

// ── Ganti kata sandi sendiri (guru) ──────────────────────────────────────────
export async function changePassword(_state: FormState, formData: FormData): Promise<FormState> {
  const session = await verifySession();
  if (!session) {
    return { ok: false, message: "Tidak diizinkan." };
  }

  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const parsed = ChangePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error) };
  }

  const { currentPassword, newPassword } = parsed.data;
  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !user.password) return { ok: false, message: "Pengguna tidak ditemukan." };

    const cocok = await bcrypt.compare(currentPassword, user.password);
    if (!cocok) {
      return { ok: false, errors: { currentPassword: ["Kata sandi saat ini salah."] } };
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    return { ok: true, message: "Kata sandi berhasil diubah." };
  } catch (err) {
    console.error("changePassword error", err);
    return { ok: false, message: "Gagal mengubah kata sandi. Coba lagi." };
  }
}
