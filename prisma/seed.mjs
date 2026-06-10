// Seed akun guru tetap (ditetapkan). Jalankan: npm run seed:guru
// Guru login pakai username + password. Tidak menimpa kata sandi bila akun
// (berdasarkan username) sudah ada, agar perubahan via dashboard tetap aman.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const NAME = process.env.GURU_SEED_NAME || "Guru ElektriKamus";
const USERNAME = (process.env.GURU_SEED_USERNAME || "guru").toLowerCase();
const PASSWORD = process.env.GURU_SEED_PASSWORD || "guru12345";

try {
  const byUsername = await prisma.user.findUnique({ where: { username: USERNAME } });
  if (byUsername) {
    console.log(`ℹ️  Akun guru sudah ada (username: ${USERNAME}) — tidak diubah.`);
  } else {
    const hashed = await bcrypt.hash(PASSWORD, 10);
    // Migrasi akun guru lama (punya nama sama tapi belum punya username).
    const byName = await prisma.user.findUnique({ where: { name: NAME } });
    if (byName) {
      await prisma.user.update({
        where: { id: byName.id },
        data: { username: USERNAME, password: hashed, role: "GURU", kelas: null },
      });
      console.log(`✅ Akun guru diperbarui (username diset).`);
    } else {
      await prisma.user.create({
        data: { name: NAME, username: USERNAME, password: hashed, role: "GURU" },
      });
      console.log("✅ Akun guru dibuat.");
    }
    console.log(`   Username : ${USERNAME}`);
    console.log(`   Password : ${PASSWORD}`);
    console.log("   (Disarankan ganti kata sandi setelah login pertama.)");
  }
} catch (e) {
  console.error("❌ Gagal seed guru:", e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
