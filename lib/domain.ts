import type { Database } from "@/lib/supabase/database.types";

/** Tipe & label istilah bisnis (kategori, status). */

type Enums = Database["public"]["Enums"];

export type ItemKategori = Enums["item_kategori"];
export type ItemStatus = Enums["item_status"];
export type ClaimStatus = Enums["claim_status"];
export type StatusPublik = "tersedia" | "dalam_proses_klaim";

export const KATEGORI_LABEL: Record<ItemKategori, string> = {
  dompet: "Dompet",
  tas: "Tas",
  elektronik: "Elektronik",
  kunci: "Kunci",
  dokumen: "Dokumen",
  pakaian: "Pakaian",
  aksesoris: "Aksesoris",
  lainnya: "Lainnya",
};

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  tersimpan: "Tersimpan",
  diklaim: "Diklaim",
  dikembalikan: "Dikembalikan",
};

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  menunggu: "Menunggu verifikasi",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  selesai: "Selesai",
};

export const STATUS_PUBLIK_LABEL: Record<StatusPublik, string> = {
  tersedia: "Tersimpan",
  dalam_proses_klaim: "Dalam proses klaim",
};

/** Peran akun petugas (kolom profiles.peran, migrasi 11). */
export const PERAN_LABEL = {
  petugas: "Petugas",
  admin: "Admin",
} as const;
export type PeranPetugas = keyof typeof PERAN_LABEL;

/** Status akun petugas (kolom profiles.status). */
export const STATUS_AKUN_LABEL = {
  aktif: "Aktif",
  nonaktif: "Nonaktif",
} as const;
export type StatusAkun = keyof typeof STATUS_AKUN_LABEL;

export const KATEGORI = kunci(KATEGORI_LABEL);
export const PERAN = kunci<PeranPetugas>(PERAN_LABEL);
export const STATUS_AKUN = kunci<StatusAkun>(STATUS_AKUN_LABEL);
export const ITEM_STATUS = kunci(ITEM_STATUS_LABEL);
export const CLAIM_STATUS = kunci(CLAIM_STATUS_LABEL);

/** Pasangan nilai–label siap pakai untuk <select>, chip filter, dll. */
export const OPSI_KATEGORI = opsi(KATEGORI_LABEL);
export const OPSI_ITEM_STATUS = opsi(ITEM_STATUS_LABEL);
export const OPSI_CLAIM_STATUS = opsi(CLAIM_STATUS_LABEL);
export const OPSI_PERAN = opsi<PeranPetugas>(PERAN_LABEL);

function kunci<K extends string>(obj: Record<K, string>) {
  return Object.keys(obj) as [K, ...K[]];
}

function opsi<K extends string>(obj: Record<K, string>): { nilai: K; label: string }[] {
  return kunci(obj).map((nilai) => ({ nilai, label: obj[nilai] }));
}
