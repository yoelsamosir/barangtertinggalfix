/**
 * Membuat teks CSV yang aman dibuka di Excel/Google Sheets.
 *
 * - Sel berisi koma, kutip, atau baris baru dibungkus tanda kutip.
 * - Teks yang diawali = + - @ (atau tab/CR) diberi awalan ' agar TIDAK
 *   dijalankan sebagai rumus oleh spreadsheet (CSV/formula injection).
 *   Angka dibiarkan apa adanya.
 * - Diawali BOM agar Excel membaca huruf non-ASCII (UTF-8) dengan benar.
 */

export type SelCsv = string | number | null | undefined;

const AWALAN_RUMUS = /^[=+\-@\t\r]/;

function amankanSel(sel: SelCsv): string {
  if (sel === null || sel === undefined) return "";
  if (typeof sel === "number") return String(sel);

  const teks = AWALAN_RUMUS.test(sel) ? `'${sel}` : sel;
  return /[",\r\n]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
}

export function keCsv(baris: SelCsv[][]): string {
  return "﻿" + baris.map((b) => b.map(amankanSel).join(",")).join("\r\n") + "\r\n";
}
