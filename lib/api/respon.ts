import "server-only";
import { TidakBerwenangError } from "@/lib/errors";
import { gagal, ok, type Hasil, type JenisGagal } from "@/lib/result";

/**
 * Menulis response REST API. Semua response berbentuk Hasil:
 *   { ok: true, data, message? }  atau  { ok: false, jenis, error, fieldErrors? }
 */

const STATUS_HTTP: Record<JenisGagal, number> = {
  validasi: 400,
  captcha: 400,
  tidak_login: 401,
  akses: 403,
  tidak_ditemukan: 404,
  konflik: 409,
  batas: 429,
  server: 500,
};

/** Data bisa berisi data pribadi: jangan pernah disimpan cache. */
const HEADER = { "Cache-Control": "private, no-store" };

export function respon<T>(hasil: Hasil<T>, statusBerhasil = 200): Response {
  const status = hasil.ok ? statusBerhasil : STATUS_HTTP[hasil.jenis];
  return Response.json(hasil, { status, headers: HEADER });
}

export function responData<T>(data: T): Response {
  return respon(ok(data));
}

/** Untuk query yang mengembalikan null bila data tidak ada. */
export function responDataAtau404<T>(data: T | null, apa: string): Response {
  return data === null ? respon(gagal("tidak_ditemukan", `${apa} tidak ditemukan.`)) : responData(data);
}

/** Tangkap error tak terduga: sesi habis -> 401, lainnya -> 500 tanpa bocorkan detail. */
export async function tangani(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof TidakBerwenangError) {
      return respon(gagal("tidak_login", error.message));
    }
    console.error("[api]", error);
    return respon(gagal("server", "Terjadi kesalahan pada server."));
  }
}
