/** Konfigurasi teknis aplikasi. */

export const ZONA_WAKTU = "Asia/Jakarta";

export const PAGE_SIZE = 20;

export const BUCKET = {
  fotoBarang: "foto-barang",
  buktiSerahTerima: "bukti-serah-terima",
} as const;

/** Sama dengan file_size_limit bucket di migrasi 3. */
export const MAKS_UKURAN_FOTO = 2 * 1024 * 1024;

/** Masa berlaku signed URL foto bukti serah terima. */
export const SIGNED_URL_TTL_DETIK = 60 * 5;
