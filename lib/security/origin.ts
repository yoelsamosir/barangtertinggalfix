import type { NextRequest } from "next/server";

/**
 * Proteksi CSRF untuk Route Handler (/api). Server Action sudah punya
 * pemeriksaan bawaan Next.js; Route Handler tidak.
 *
 * Request yang mengubah data dari browser situs lain ditolak.
 * Tanpa header Origin (mis. Postman/curl) tetap diizinkan: bukan skenario
 * CSRF karena tidak membawa cookie korban secara otomatis.
 */

const METODE_AMAN = new Set(["GET", "HEAD", "OPTIONS"]);

export function isRequestLintasSitus(request: NextRequest): boolean {
  if (METODE_AMAN.has(request.method)) return false;

  if (request.headers.get("sec-fetch-site") === "cross-site") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}
