import { PAGE_SIZE } from "@/lib/config";

/** Nomor halaman dari query string; nilai tidak valid menjadi 1. */
export function parseHalaman(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function offsetHalaman(halaman: number): number {
  return (halaman - 1) * PAGE_SIZE;
}

/** Rentang baris untuk `.range()` Supabase. */
export function rentangHalaman(halaman: number): [number, number] {
  const dari = offsetHalaman(halaman);
  return [dari, dari + PAGE_SIZE - 1];
}

export type InfoHalaman = { total: number; halaman: number; jumlahHalaman: number };

export function infoHalaman(total: number | null, halaman: number): InfoHalaman {
  const t = total ?? 0;
  return { total: t, halaman, jumlahHalaman: Math.max(1, Math.ceil(t / PAGE_SIZE)) };
}
