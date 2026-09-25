import type { NextRequest } from "next/server";

/**
 * Proteksi CSRF untuk Route Handler (/api). Server Action sudah punya
 * pemeriksaan bawaan Next.js; Route Handler tidak.
 *
 * Request yang mengubah data dari browser situs lain ditolak.
 * Tanpa header Origin (mis. Postman/curl) tetap diizinkan: bukan skenario
 * CSRF karena tidak membawa cookie korban secara otomatis.
 *
 * Origin dicocokkan dengan DAFTAR TETAP (env APP_URL, plus URL deploy preview
 * Vercel), bukan dengan header Host / X-Forwarded-Host yang di sebagian proxy
 * bisa diteruskan apa adanya dari klien.
 */

const METODE_AMAN = new Set(["GET", "HEAD", "OPTIONS"]);

let originResmiCache: Set<string> | null = null;

/** Origin resmi aplikasi (skema + host + port). Kosong = APP_URL belum diisi. */
function originResmi(): Set<string> {
  if (originResmiCache) return originResmiCache;

  const kandidat = [process.env.APP_URL];
  // Deploy preview Vercel punya URL berbeda di setiap deploy.
  if (process.env.VERCEL_ENV === "preview") {
    kandidat.push(process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL);
  }

  // VERCEL_URL tanpa skema (mis. "app-abc.vercel.app") -> https://.
  const origin = kandidat.map((u) => (u ? keOrigin(u.includes("://") ? u : `https://${u}`) : ""));
  originResmiCache = new Set(origin.filter(Boolean));
  return originResmiCache;
}

/** "https://contoh.id/jalur" -> "https://contoh.id"; "" bila bukan URL valid. */
function keOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

export function isRequestLintasSitus(request: NextRequest): boolean {
  if (METODE_AMAN.has(request.method)) return false;

  if (request.headers.get("sec-fetch-site") === "cross-site") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  const resmi = originResmi();
  if (resmi.size > 0) return !resmi.has(keOrigin(origin));

  // APP_URL belum diisi. Pengembangan lokal: cukup cocokkan dengan Host.
  // Production: tolak (lebih aman menolak daripada menerima tanpa daftar).
  if (process.env.NODE_ENV !== "production") {
    const host = request.headers.get("host");
    return keOrigin(origin) === "" || new URL(origin).host !== host;
  }
  console.error("[csrf] APP_URL belum diisi; request ber-Origin ke /api ditolak.");
  return true;
}
