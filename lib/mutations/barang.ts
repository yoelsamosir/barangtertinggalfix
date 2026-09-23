import "server-only";
import { gagalDb, isForeignKeyError } from "@/lib/errors";
import { gagal, ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";
import type { BarangInput } from "@/lib/validation/barang";

/**
 * Operasi tulis tabel items. Hanya urusan database —
 * otorisasi, file, dan refresh halaman diurus services.
 */

type DataBarang = BarangInput & { foto_path: string | null };

export async function buatBarang(
  supabase: Supabase,
  data: DataBarang,
): Promise<Hasil<{ id: string; kode_barang: string }>> {
  const { data: baru, error } = await supabase.from("items").insert(data).select("id, kode_barang").single();

  if (error) return gagalDb(error, "Gagal menyimpan barang.");
  return ok(baru);
}

export async function ambilFotoPathBarang(supabase: Supabase, id: string): Promise<Hasil<string | null>> {
  const { data, error } = await supabase.from("items").select("foto_path").eq("id", id).maybeSingle();

  if (error) return gagalDb(error);
  if (!data) return gagal("tidak_ditemukan", "Barang tidak ditemukan.");
  return ok(data.foto_path);
}

export async function perbaruiBarang(supabase: Supabase, id: string, data: DataBarang): Promise<Hasil> {
  const { error } = await supabase.from("items").update(data).eq("id", id);

  if (error) return gagalDb(error, "Gagal memperbarui barang.");
  return ok();
}

/** Hanya barang 'tersimpan' tanpa klaim (dijaga RLS & FK). Mengembalikan path fotonya. */
export async function hapusBarangTersimpan(supabase: Supabase, id: string): Promise<Hasil<string | null>> {
  const { data, error } = await supabase.from("items").delete().eq("id", id).select("foto_path");

  if (error) {
    if (isForeignKeyError(error)) {
      return gagal("konflik", "Barang sudah memiliki pengajuan klaim sehingga tidak dapat dihapus.");
    }
    return gagalDb(error, "Gagal menghapus barang.");
  }
  if (!data.length) return gagal("konflik", "Barang tidak ditemukan atau statusnya bukan 'Tersimpan'.");

  return ok(data[0].foto_path);
}
