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

export const API = {
  prefix: "/api",
  /** Semua endpoint di bawah prefix ini wajib login petugas. */
  petugas: "/api/petugas",
} as const;
