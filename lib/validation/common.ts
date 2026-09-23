import { z } from "zod";
import { hariIniWIB } from "@/lib/utils/tanggal";

/** Blok pembangun skema yang dipakai lintas domain. */

export const teksWajib = (label: string, max: number) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`);

/** String kosong menjadi null. */
export const teksOpsional = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter.`)
    .optional()
    .transform((v) => v || null);

/** Tanggal YYYY-MM-DD yang tidak boleh melewati hari ini (WIB). */
export const tanggalLampau = (label: string) =>
  z.iso
    .date({ error: `${label} tidak valid.` })
    .refine((v) => v <= hariIniWIB(), `${label} tidak boleh di masa depan.`);

export const uuid = (label: string) => z.uuid(`${label} tidak valid.`);

/**
 * Nilai ya/tidak dari form ("on" bila dicentang, tidak terkirim bila tidak)
 * maupun dari JSON API (true/false).
 */
export const checkbox = z
  .union([z.boolean(), z.enum(["on", "true", "1", "false", "0"])])
  .optional()
  .transform((v) => v === true || v === "on" || v === "true" || v === "1");

/** Token Cloudflare Turnstile dari widget di halaman. */
export const captchaToken = z
  .string({ error: "Verifikasi keamanan diperlukan." })
  .min(1, "Verifikasi keamanan diperlukan.")
  .max(4096);

/** Parameter filter dari URL: nilai tidak valid diabaikan, bukan error. */
export const filterOpsional = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined);

export const kataKunci = filterOpsional(z.string().trim().max(100));
