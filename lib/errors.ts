import { gagal, type Gagal } from "@/lib/result";

/** Penerjemahan error database & error akses. */

type PgError = { code?: string; message?: string };

/**
 * Error database -> Gagal yang aman ditampilkan.
 * Pesan dari `raise exception` di fungsi database (P0001/P0002/PT429)
 * sudah berbahasa Indonesia; error lain disamarkan dan dicatat.
 */
export function gagalDb(error: PgError, fallback = "Terjadi kesalahan. Silakan coba lagi."): Gagal {
  const pesan = error.message ?? fallback;
  switch (error.code) {
    case "P0001":
      return gagal("konflik", pesan);
    case "P0002":
      return gagal("tidak_ditemukan", pesan);
    case "PT429":
      return gagal("batas", pesan);
    case "42501":
      return gagal("akses", "Anda tidak memiliki akses untuk tindakan ini.");
    case "23503":
      return gagal("konflik", "Data masih terhubung dengan data lain sehingga tidak dapat dihapus.");
    case "23505":
      return gagal("konflik", "Data yang sama sudah ada.");
    case "23514":
      return gagal("validasi", "Ada isian yang tidak memenuhi ketentuan.");
    default:
      console.error("[db]", error);
      return gagal("server", fallback);
  }
}

export function isForeignKeyError(error: PgError): boolean {
  return error.code === "23503";
}

/** ID dari URL yang bukan UUID — perlakukan sebagai "tidak ditemukan". */
export function isIdTidakValid(error: PgError): boolean {
  return error.code === "22P02";
}

/** Kegagalan membaca data: dicatat, lalu dilempar ke error boundary / API 500. */
export function gagalMemuat(apa: string, error: unknown): never {
  console.error(`[data] gagal memuat ${apa}`, error);
  throw new Error(`Gagal memuat ${apa}.`);
}

/**
 * Dilempar bila pemanggil bukan petugas aktif. Ditangkap oleh adapter:
 * Server Action -> redirect ke /login, API -> 401.
 */
export class TidakBerwenangError extends Error {
  constructor() {
    super("Silakan login sebagai petugas.");
    this.name = "TidakBerwenangError";
  }
}
