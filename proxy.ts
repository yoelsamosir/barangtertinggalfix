import { NextResponse, type NextRequest } from "next/server";
import { API, ROUTES } from "@/lib/routes";
import { buatCsp, buatNonce } from "@/lib/security/csp";
import { isRequestLintasSitus } from "@/lib/security/origin";
import { denganCookieSesi, perbaruiSesi } from "@/lib/supabase/proxy";

/**
 * Penjaga pertama setiap request (pemeriksaan cepat/optimistis).
 * Otorisasi sebenarnya tetap di services/queries (pastikanPetugas) & RLS.
 */
export async function proxy(request: NextRequest) {
  return request.nextUrl.pathname.startsWith(API.prefix) ? jagaApi(request) : jagaHalaman(request);
}

/** API: tolak CSRF, dan tolak /api/petugas tanpa sesi dengan 401 (bukan redirect). */
async function jagaApi(request: NextRequest) {
  if (isRequestLintasSitus(request)) {
    return NextResponse.json({ ok: false, jenis: "akses", error: "Request lintas situs ditolak." }, { status: 403 });
  }

  const { response, sudahLogin } = await perbaruiSesi(request);

  if (!sudahLogin && request.nextUrl.pathname.startsWith(API.petugas)) {
    return denganCookieSesi(
      NextResponse.json({ ok: false, jenis: "tidak_login", error: "Silakan login sebagai petugas." }, { status: 401 }),
      response,
    );
  }
  return response;
}

/** Halaman: pasang CSP ber-nonce, lalu arahkan tamu/petugas ke halaman yang sesuai. */
async function jagaHalaman(request: NextRequest) {
  const nonce = buatNonce();
  const csp = buatCsp(nonce);

  const { response, sudahLogin } = await perbaruiSesi(request, {
    "x-nonce": nonce,
    "Content-Security-Policy": csp,
  });

  const { pathname } = request.nextUrl;
  const tujuan =
    !sudahLogin && pathname.startsWith(ROUTES.dashboard)
      ? ROUTES.login
      : sudahLogin && pathname === ROUTES.login
        ? ROUTES.dashboard
        : null;

  const hasil = tujuan ? denganCookieSesi(NextResponse.redirect(new URL(tujuan, request.url)), response) : response;

  hasil.headers.set("Content-Security-Policy", csp);
  return hasil;
}

export const config = {
  matcher: [
    {
      // Semua path kecuali aset statis, gambar, dan prefetch link.
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
