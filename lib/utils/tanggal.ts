import { ZONA_WAKTU } from "@/lib/config";

/** Tanggal hari ini (YYYY-MM-DD) menurut WIB, bukan zona waktu server (UTC di Vercel). */
export function hariIniWIB(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_WAKTU }).format(new Date());
}

export function tahunIniWIB(): number {
  return Number(hariIniWIB().slice(0, 4));
}

/** "2026-09-01" -> awal hari tersebut dalam WIB (ISO timestamp). */
export function awalHariWIB(tanggal: string): string {
  return `${tanggal}T00:00:00+07:00`;
}

/** "2026-09-01" -> akhir hari tersebut dalam WIB (ISO timestamp). */
export function akhirHariWIB(tanggal: string): string {
  return `${tanggal}T23:59:59.999+07:00`;
}
