import "server-only";
import { createHmac } from "node:crypto";
import { envServer } from "@/lib/env-server";
import { gagal, ok, type Hasil } from "@/lib/result";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Rate limit berbasis tabel `rate_limit` di Supabase (fixed window).
 * IP/email disimpan sebagai HMAC — tidak pernah tersimpan mentah.
 */

type Aturan = { nama: string; maks: number; jendelaDetik: number; pesan: string };

export const ATURAN = {
  klaimPerIp: {
    nama: "klaim:ip",
    maks: 5,
    jendelaDetik: 60 * 60,
    pesan: "Terlalu banyak pengajuan klaim. Silakan coba lagi dalam 1 jam.",
  },
  loginPerIp: {
    nama: "login:ip",
    maks: 20,
    jendelaDetik: 15 * 60,
    pesan: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
  /** Hanya menghitung password SALAH setelah captcha lolos (anti penguncian akun). */
  loginGagalPerEmail: {
    nama: "login:email",
    maks: 5,
    jendelaDetik: 15 * 60,
    pesan: "Terlalu banyak percobaan login untuk akun ini. Silakan coba lagi dalam 15 menit.",
  },
} satisfies Record<string, Aturan>;

/** Pakai satu kuota. Bila gagal dicek (database error), request ditolak. */
export async function batasi(aturan: Aturan, nilai: string): Promise<Hasil> {
  return jalankanRpc("pakai_kuota", aturan, nilai);
}

/** Cek sisa kuota tanpa memakainya (untuk menghitung hanya percobaan yang gagal). */
export async function cekKuota(aturan: Aturan, nilai: string): Promise<Hasil> {
  return jalankanRpc("kuota_tersedia", aturan, nilai);
}

async function jalankanRpc(fungsi: "pakai_kuota" | "kuota_tersedia", aturan: Aturan, nilai: string): Promise<Hasil> {
  const { data: masihBoleh, error } = await createAdminClient().rpc(fungsi, {
    p_kunci: `${aturan.nama}:${hmac(nilai)}`,
    p_maks: aturan.maks,
    p_jendela_detik: aturan.jendelaDetik,
  });

  if (error) {
    console.error("[rate-limit]", error);
    return gagal("server", "Layanan sedang sibuk. Silakan coba lagi.");
  }
  return masihBoleh ? ok() : gagal("batas", aturan.pesan);
}

function hmac(nilai: string): string {
  return createHmac("sha256", envServer().IP_HASH_SECRET).update(nilai.toLowerCase()).digest("hex");
}
