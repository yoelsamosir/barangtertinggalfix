/**
 * Filter `.or()` PostgREST: "kolom1 ILIKE %q% OR kolom2 ILIKE %q% ...".
 * Karakter , ( ) " \ * % : punya arti khusus di sintaks filter sehingga dibuang.
 * Mengembalikan null bila kata kunci kosong (tidak perlu filter).
 */
export function filterCari(kolom: readonly string[], cari: string | undefined): string | null {
  const q = (cari ?? "").replace(/[,()"\\*%:]/g, " ").trim();
  if (!q) return null;
  return kolom.map((k) => `${k}.ilike.%${q}%`).join(",");
}
