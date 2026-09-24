import { ZONA_WAKTU } from "@/lib/config";

/** Tanggal hari ini (YYYY-MM-DD) menurut WIB, bukan zona waktu server (UTC di Vercel). */
export function hariIniWIB(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_WAKTU }).format(new Date());
}

export function tahunIniWIB(): number {
  return Number(hariIniWIB().slice(0, 4));
}

/** Kolom `date` "2026-09-01" -> "1 September 2026". */
export function formatTanggal(tanggal: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" }).format(new Date(tanggal));
}

/** Kolom `timestamptz` -> "24 Sep 2026, 14.05" dalam WIB. */
export function formatWaktu(waktu: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: ZONA_WAKTU }).format(
    new Date(waktu),
  );
}

/** "2026-09-01" -> awal hari tersebut dalam WIB (ISO timestamp). */
export function awalHariWIB(tanggal: string): string {
  return `${tanggal}T00:00:00+07:00`;
}

/** "2026-09-01" -> akhir hari tersebut dalam WIB (ISO timestamp). */
export function akhirHariWIB(tanggal: string): string {
  return `${tanggal}T23:59:59.999+07:00`;
}
