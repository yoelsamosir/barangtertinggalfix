import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { catatPengembalian } from "@/lib/mutations/pengembalian";
import { gagal, gagalValidasi, ok, padaField, type Hasil } from "@/lib/result";
import { revalidasiSemua } from "@/lib/revalidate";
import { hapusBukti, unggahBukti } from "@/lib/storage/bukti-serah-terima";
import { createClient } from "@/lib/supabase/server";
import { pengembalianSchema } from "@/lib/validation/pengembalian";

/**
 * PETUGAS — serah terima barang kepada pengklaim yang sudah disetujui.
 * Foto diunggah dulu, lalu dicatat dalam satu transaksi database.
 * Bila pencatatan gagal, foto dihapus lagi.
 */
export async function serahTerima(input: unknown, foto: File | null): Promise<Hasil<{ return_id: string }>> {
  await pastikanPetugas();

  const parsed = pengembalianSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);
  const { claim_id, persetujuan_foto, catatan } = parsed.data;

  if (!foto) {
    return padaField(gagal("validasi", "Foto bukti serah terima wajib diambil."), "foto");
  }

  const supabase = await createClient();

  const unggahan = await unggahBukti(supabase, claim_id, foto);
  if (!unggahan.ok) return padaField(unggahan, "foto");

  const hasil = await catatPengembalian(supabase, {
    claimId: claim_id,
    fotoPath: unggahan.data,
    persetujuanFoto: persetujuan_foto,
    catatan,
  });
  if (!hasil.ok) {
    await hapusBukti(supabase, unggahan.data);
    return hasil;
  }

  revalidasiSemua();
  return ok({ return_id: hasil.data }, "Pengembalian barang berhasil dicatat.");
}
