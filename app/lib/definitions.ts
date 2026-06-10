import * as z from "zod";

// ── Skema validasi form ──────────────────────────────────────────────────────
// MURID cukup nama lengkap + kelas (tanpa email/password). Nama = identitas unik.
export const MuridSchema = z.object({
  name: z.string().min(3, "Tulis nama lengkap (minimal 3 karakter).").trim(),
  kelas: z.string().min(1, "Kelas wajib diisi.").trim(),
});

// GURU login pakai username + password.
export const GuruLoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi.").trim().toLowerCase(),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

// Guru menambah akun guru lain dari dashboard.
export const AddGuruSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").trim(),
  username: z.string().min(3, "Username minimal 3 karakter.").trim().toLowerCase(),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

// Guru mengganti kata sandi sendiri.
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

// ── State hasil form (untuk useActionState) ──────────────────────────────────
export type FormState =
  | {
      ok?: boolean;
      errors?: Record<string, string[]>;
      message?: string;
      values?: Record<string, string>;
    }
  | undefined;

// Alias lama agar import yang ada tetap jalan.
export type AuthState = FormState;

// ── Payload sesi (disimpan di cookie terenkripsi) ────────────────────────────
export type SessionPayload = {
  userId: string;
  role: "GURU" | "MURID";
  name: string;
  expiresAt: string;
};
