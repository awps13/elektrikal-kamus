import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

type Session = { userId: string; role: "GURU" | "MURID" } | null;

async function readSession(req: NextRequest): Promise<Session> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return { userId: payload.userId as string, role: payload.role as "GURU" | "MURID" };
  } catch {
    return null;
  }
}

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await readSession(req);

  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
  const isAuthPage = AUTH_PAGES.includes(path);

  // Belum login mencoba akses halaman terproteksi → ke /login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Sudah login membuka /login → arahkan sesuai peran
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(session.role === "GURU" ? "/dashboard" : "/modul", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
