"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/db";
import { verifySession } from "../lib/dal";

export type SubmitState = { ok: boolean; message: string };

// Murid mengirim hasil kuis ke dashboard guru.
export async function submitQuizResult(input: {
  score: number;
  total: number;
}): Promise<SubmitState> {
  const session = await verifySession();
  if (!session) {
    return { ok: false, message: "Anda belum masuk. Silakan login sebagai murid untuk mengirim hasil." };
  }
  if (session.role !== "MURID") {
    return { ok: false, message: "Hanya akun murid yang dapat mengirim hasil kuis." };
  }

  const score = Math.max(0, Math.floor(input.score));
  const total = Math.max(1, Math.floor(input.total));
  if (score > total) {
    return { ok: false, message: "Data nilai tidak valid." };
  }
  const percentage = Math.round((score / total) * 100);

  try {
    await prisma.quizResult.create({
      data: { userId: session.userId, score, total, percentage },
    });
    revalidatePath("/dashboard");
    return { ok: true, message: "Hasil kuis berhasil dikirim ke dashboard guru! 🎉" };
  } catch (err) {
    console.error("submitQuizResult error", err);
    return { ok: false, message: "Gagal mengirim hasil. Coba lagi." };
  }
}
