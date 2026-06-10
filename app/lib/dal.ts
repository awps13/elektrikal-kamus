import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { prisma } from "./db";

// Verifikasi sesi (optimistic) — dari cookie. Memoized per render.
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;
  return { userId: session.userId, role: session.role, name: session.name };
});

// Ambil data user dari database berdasarkan sesi.
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, kelas: true, username: true, role: true, createdAt: true },
    });
    return user;
  } catch {
    return null;
  }
});

// Wajib login — redirect ke /login bila belum.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Wajib login sebagai GURU — redirect bila bukan guru.
export async function requireGuru() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "GURU") redirect("/dashboard");
  return user;
}
