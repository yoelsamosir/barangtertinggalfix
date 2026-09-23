import "server-only";
import { BUCKET } from "@/lib/config";
import { ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";
import { hapusFile, unggahFoto } from "./unggah";

/** Foto barang — bucket publik, tampil di halaman pengunjung. */

/** Tanpa file -> ok(null), karena foto barang tidak wajib. */
export async function unggahFotoBarang(supabase: Supabase, file: File | null): Promise<Hasil<string | null>> {
  if (!file) return ok(null);
  return unggahFoto(supabase, BUCKET.fotoBarang, file);
}

export async function hapusFotoBarang(supabase: Supabase, path: string | null) {
  await hapusFile(supabase, BUCKET.fotoBarang, path);
}

/** URL publik (dibentuk lokal, tanpa request jaringan). */
export function urlFotoBarang(supabase: Supabase, path: string | null): string | null {
  return path ? supabase.storage.from(BUCKET.fotoBarang).getPublicUrl(path).data.publicUrl : null;
}
