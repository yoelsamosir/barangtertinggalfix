import "server-only";
import { BUCKET, SIGNED_URL_TTL_DETIK } from "@/lib/config";
import type { Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";
import { hapusFile, unggahFoto } from "./unggah";

/** Foto bukti serah terima — bucket PRIVAT, hanya petugas. */

/** Disimpan per klaim: <claim_id>/<acak>.jpg */
export async function unggahBukti(supabase: Supabase, claimId: string, file: File): Promise<Hasil<string>> {
  return unggahFoto(supabase, BUCKET.buktiSerahTerima, file, claimId);
}

/** Hanya berhasil untuk file yang belum tercatat di returns (dijaga policy). */
export async function hapusBukti(supabase: Supabase, path: string) {
  await hapusFile(supabase, BUCKET.buktiSerahTerima, path);
}

/** URL sementara untuk menampilkan foto kepada petugas. */
export async function urlSementaraBukti(supabase: Supabase, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET.buktiSerahTerima)
    .createSignedUrl(path, SIGNED_URL_TTL_DETIK);

  if (error) console.error("[storage] signed url bukti", error);
  return data?.signedUrl ?? null;
}
