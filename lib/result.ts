import { z } from "zod";

/**
 * Bentuk hasil semua use case (services). Dipakai apa adanya oleh
 * Server Action, dan diterjemahkan ke HTTP status oleh API (lib/api).
 */

export type JenisGagal =
  "validasi" | "captcha" | "tidak_login" | "akses" | "tidak_ditemukan" | "konflik" | "batas" | "server";

export type FieldErrors = Record<string, string[] | undefined>;

export type Berhasil<T> = { ok: true; data: T; message?: string };
export type Gagal = { ok: false; jenis: JenisGagal; error: string; fieldErrors?: FieldErrors };
export type Hasil<T = void> = Berhasil<T> | Gagal;

export function ok(): Berhasil<void>;
export function ok<T>(data: T, message?: string): Berhasil<T>;
export function ok<T>(data?: T, message?: string): Berhasil<T | undefined> {
  return { ok: true, data, message };
}

export function gagal(jenis: JenisGagal, error: string, fieldErrors?: FieldErrors): Gagal {
  return { ok: false, jenis, error, fieldErrors };
}

export function gagalValidasi(error: z.ZodError): Gagal {
  return gagal("validasi", "Periksa kembali isian formulir.", z.flattenError(error).fieldErrors as FieldErrors);
}

/** Tandai kegagalan sebagai milik satu field form (jenisnya dipertahankan). */
export function padaField(hasil: Gagal, field: string): Gagal {
  return { ...hasil, fieldErrors: { ...hasil.fieldErrors, [field]: [hasil.error] } };
}
