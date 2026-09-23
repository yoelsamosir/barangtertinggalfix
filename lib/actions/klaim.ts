"use server";

import { formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import * as layanan from "@/lib/services/klaim";
import { jalankan } from "./jalankan";

/**
 * PUBLIK. Field: item_id, nama_pengklaim, no_hp, waktu_kehilangan,
 * lokasi_kehilangan, ciri_barang, keterangan, cf-turnstile-response
 */
export async function ajukanKlaim(
  _prev: Hasil<{ nomor_klaim: string }> | null,
  formData: FormData,
): Promise<Hasil<{ nomor_klaim: string }>> {
  return layanan.ajukanKlaim(formToObject(formData));
}

/** PETUGAS. Field: claim_id, keputusan ('setujui' | 'tolak'), catatan (wajib bila tolak) */
export async function verifikasiKlaim(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.verifikasiKlaim(formToObject(formData)));
}
