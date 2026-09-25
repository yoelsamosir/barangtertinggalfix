/** Konfigurasi teknis aplikasi. */

export const ZONA_WAKTU = "Asia/Jakarta";

export const PAGE_SIZE = 20;

export const BUCKET = {
  fotoBarang: "foto-barang",
  buktiSerahTerima: "bukti-serah-terima",
} as const;

/**
 * Foto yang DIUNGGAH (foto HP biasanya 3–5 MB). Setelah diproses ulang
 * (WEBP, sisi maks 1600 px) hasilnya jauh di bawah batas bucket 2 MB.
 */
export const MAKS_UKURAN_FOTO = 4 * 1024 * 1024;
export const SISI_MAKS_FOTO = 1600;
/** Tolak gambar raksasa (serangan "decompression bomb"); 60 MP cukup untuk kamera HP. */
export const MAKS_PIKSEL_FOTO = 60_000_000;

/**
 * Batas satu request berisi foto + field form. Batas Vercel adalah 4,5 MB,
 * jadi nilai ini tidak boleh lebih besar.
 */
export const MAKS_BODY_REQUEST = 4.5 * 1024 * 1024;

/** Masa berlaku signed URL foto bukti serah terima. */
export const SIGNED_URL_TTL_DETIK = 60 * 5;

/**
 * Masa berlaku token akses Supabase (menit). Setelah password diganti, perangkat lain
 * baru benar-benar keluar saat tokennya kedaluwarsa. HARUS sama dengan jwt_expiry
 * di supabase/config.toml (lokal) dan pengaturan JWT expiry di Supabase online.
 */
export const MASA_TOKEN_MENIT = 10;
