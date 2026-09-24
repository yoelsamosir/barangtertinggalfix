/** Satu sumber untuk semua path halaman & prefix API. */
export const ROUTES = {
  beranda: "/",
  barangPublik: (id: string) => `/barang/${id}`,
  klaimPublik: (itemId: string) => `/klaim/${itemId}`,
  login: "/login",

  dashboard: "/dashboard",
  barang: "/dashboard/barang",
  barangTambah: "/dashboard/barang/tambah",
  barangDetail: (id: string) => `/dashboard/barang/${id}`,
  klaim: "/dashboard/klaim",
  klaimDetail: (id: string) => `/dashboard/klaim/${id}`,
  serahTerima: (claimId: string) => `/dashboard/klaim/${claimId}/serah-terima`,
  pengembalian: "/dashboard/pengembalian",
  pengembalianDetail: (id: string) => `/dashboard/pengembalian/${id}`,
  laporan: "/dashboard/laporan",
  profil: "/dashboard/profil",
} as const;

/** Path + query string; parameter kosong dibuang. */
export function denganQuery(path: string, params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [kunci, nilai] of Object.entries(params)) {
    if (nilai !== undefined && nilai !== "") q.set(kunci, String(nilai));
  }
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export const API = {
  prefix: "/api",
  /** Semua endpoint di bawah prefix ini wajib login petugas. */
  petugas: "/api/petugas",
} as const;
