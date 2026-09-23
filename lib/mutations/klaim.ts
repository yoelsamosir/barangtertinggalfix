import "server-only";
import { gagalDb } from "@/lib/errors";
import { ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";
import type { AjukanKlaimInput, VerifikasiKlaimInput } from "@/lib/validation/klaim";

/** Operasi tulis klaim — lewat fungsi database (aturan bisnis ada di sana). */

/**
 * Wajib dipanggil dengan klien service_role (createAdminClient):
 * fungsi ajukan_klaim sengaja tidak bisa dipanggil anon.
 * Mengembalikan nomor klaim, mis. CLM-2026-001.
 */
export async function buatKlaim(admin: Supabase, input: AjukanKlaimInput): Promise<Hasil<string>> {
  const { data, error } = await admin.rpc("ajukan_klaim", {
    p_item_id: input.item_id,
    p_nama_pengklaim: input.nama_pengklaim,
    p_no_hp: input.no_hp,
    p_waktu_kehilangan: input.waktu_kehilangan,
    p_lokasi_kehilangan: input.lokasi_kehilangan,
    p_ciri_barang: input.ciri_barang,
    p_keterangan: input.keterangan ?? undefined,
  });

  if (error) return gagalDb(error, "Gagal mengajukan klaim.");
  return ok(data);
}

export async function simpanKeputusanKlaim(supabase: Supabase, input: VerifikasiKlaimInput): Promise<Hasil> {
  const { error } = await supabase.rpc("verifikasi_klaim", {
    p_claim_id: input.claim_id,
    p_setujui: input.keputusan === "setujui",
    p_catatan: input.catatan ?? undefined,
  });

  if (error) return gagalDb(error, "Gagal memproses verifikasi klaim.");
  return ok();
}
