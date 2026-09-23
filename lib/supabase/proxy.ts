import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Menyegarkan token sesi Supabase untuk request ini.
 * `headerRequest` diteruskan ke halaman (mis. nonce CSP).
 * Tidak memutuskan routing — itu tugas proxy.ts di root.
 */
export async function perbaruiSesi(request: NextRequest, headerRequest: Record<string, string> = {}) {
  const lanjutkan = () => {
    // dibuat ulang setelah cookie berubah agar header "cookie" ikut terbaru
    const headers = new Headers(request.headers);
    Object.entries(headerRequest).forEach(([key, value]) => headers.set(key, value));
    return NextResponse.next({ request: { headers } });
  };

  let response = lanjutkan();

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = lanjutkan();
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Jangan menaruh kode apa pun di antara createServerClient dan getClaims().
  const { data } = await supabase.auth.getClaims();

  return { response, sudahLogin: Boolean(data?.claims?.sub) };
}

/** Salin cookie sesi yang baru disegarkan ke response lain (redirect / 401). */
export function denganCookieSesi<T extends NextResponse>(target: T, sesi: NextResponse): T {
  sesi.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}
