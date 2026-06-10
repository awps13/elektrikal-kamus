import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Catatan: "output: export" dihapus karena aplikasi kini membutuhkan server
  // (autentikasi, database Neon via Prisma, dan Server Actions).
  images: { unoptimized: true },
};

export default nextConfig;
