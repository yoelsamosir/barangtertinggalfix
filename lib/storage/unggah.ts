import "server-only";
import { gagal, ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";
import { validasiFoto } from "./validasi-foto";

/**
 * Validasi lalu unggah foto ke bucket dengan nama acak.
 * Mengembalikan path file di dalam bucket.
 */
export async function unggahFoto(
  supabase: Supabase,
  bucket: string,
  file: File,
  folder?: string,
): Promise<Hasil<string>> {
  const foto = await validasiFoto(file);
  if (!foto.ok) return foto;

  const nama = `${crypto.randomUUID()}.${foto.data.ekstensi}`;
  const path = folder ? `${folder}/${nama}` : nama;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: foto.data.contentType, upsert: false });

  if (error) {
    console.error(`[storage] unggah ke ${bucket}`, error);
    return gagal("server", "Gagal mengunggah foto. Silakan coba lagi.");
  }
  return ok(path);
}

/** Hapus file; kegagalan hanya dicatat (tidak menggagalkan proses utama). */
export async function hapusFile(supabase: Supabase, bucket: string, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error(`[storage] hapus dari ${bucket}`, error);
}
