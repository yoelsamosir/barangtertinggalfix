import "server-only";
import { gagalDb } from "@/lib/errors";
import { ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";

/**
 * Catat serah terima dalam satu transaksi database:
 * returns (baru) + klaim 'selesai' + barang 'dikembalikan'.
 * Foto bukti harus sudah ada di Storage. Mengembalikan id pengembalian.
 */
export async function catatPengembalian(
  supabase: Supabase,
  data: { claimId: string; fotoPath: string; persetujuanFoto: boolean; catatan: string | null },
): Promise<Hasil<string>> {
  const { data: id, error } = await supabase.rpc("proses_pengembalian", {
    p_claim_id: data.claimId,
    p_foto_path: data.fotoPath,
    p_persetujuan_foto: data.persetujuanFoto,
    p_catatan: data.catatan ?? undefined,
  });

  if (error) return gagalDb(error, "Gagal menyimpan pengembalian.");
  return ok(id);
}
