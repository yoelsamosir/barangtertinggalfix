import "server-only";
import { envServer } from "@/lib/env-server";
import { gagal, ok, type Hasil } from "@/lib/result";

/**
 * Verifikasi token Cloudflare Turnstile di server.
 * Dipakai untuk form klaim publik. (Login diverifikasi langsung oleh
 * Supabase Auth, karena token hanya berlaku sekali.)
 */

const URL_VERIFIKASI = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type ResponsTurnstile = { success: boolean; "error-codes"?: string[] };

export async function verifikasiTurnstile(token: string, ip: string): Promise<Hasil> {
  try {
    const res = await fetch(URL_VERIFIKASI, {
      method: "POST",
      body: new URLSearchParams({ secret: envServer().TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const hasil = (await res.json()) as ResponsTurnstile;

    if (!hasil.success) {
      console.warn("[turnstile] ditolak", hasil["error-codes"]);
      return gagal("captcha", "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.");
    }
    return ok();
  } catch (error) {
    console.error("[turnstile] tidak bisa dihubungi", error);
    return gagal("server", "Verifikasi keamanan tidak dapat diproses. Silakan coba lagi.");
  }
}
