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
  barangUbah: (id: string) => `/dashboard/barang/${id}/ubah`,
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

/**
 * Pesan singkat setelah sebuah aksi, dibawa lewat URL tujuan redirect
 * (mis. /dashboard/barang/123?info=baru). Halaman tujuan menerjemahkannya.
 */
export const PARAM_INFO = "info";

export function denganInfo(path: string, info: string): string {
  return denganQuery(path, { [PARAM_INFO]: info });
}

/** Nama parameter URL halaman tujuan setelah login. */
export const PARAM_KEMBALI = "kembali";

/** /login?kembali=/dashboard/klaim/123 — dipakai saat halaman petugas dibuka tanpa sesi. */
export function loginLaluKembaliKe(tujuan: string): string {
  return denganQuery(ROUTES.login, { [PARAM_KEMBALI]: tujuan });
}

/**
 * Tujuan setelah login yang AMAN: hanya path internal di bawah /dashboard.
 * Selain itu (URL situs lain, "//evil.com", nilai kosong) -> /dashboard,
 * agar parameter `kembali` tidak bisa dipakai untuk open redirect.
 */
export function tujuanSetelahLogin(kembali: unknown): string {
  if (typeof kembali !== "string" || !kembali.startsWith("/")) return ROUTES.dashboard;
  try {
    const ASAL = "http://lokal";
    const url = new URL(kembali, ASAL);
    const diDashboard = url.pathname === ROUTES.dashboard || url.pathname.startsWith(`${ROUTES.dashboard}/`);
    return url.origin === ASAL && diDashboard ? url.pathname + url.search : ROUTES.dashboard;
  } catch {
    return ROUTES.dashboard;
  }
}

export const API = {
  prefix: "/api",
  /** Semua endpoint di bawah prefix ini wajib login petugas. */
  petugas: "/api/petugas",
} as const;
