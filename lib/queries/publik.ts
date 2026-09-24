import "server-only";
import { cache } from "react";
import { PAGE_SIZE } from "@/lib/config";
import type { StatusPublik } from "@/lib/domain";
import { gagalMemuat, isIdTidakValid } from "@/lib/errors";
import { infoHalaman, offsetHalaman } from "@/lib/pagination";
import { urlFotoBarang } from "@/lib/storage/foto-barang";
import { createClient } from "@/lib/supabase/server";
import type { Supabase } from "@/lib/supabase/types";
import type { Database } from "@/lib/supabase/database.types";
import type { FilterBarangPublik } from "@/lib/validation/barang";

/**
 * Data untuk pengunjung (tanpa login). Hanya lewat fungsi database
 * *_publik yang mengembalikan kolom aman.
 */

type BarisPublik = Database["public"]["Functions"]["barang_publik_detail"]["Returns"][number];

function keBarangPublik(supabase: Supabase, b: BarisPublik) {
  return {
    id: b.id,
    nama_barang: b.nama_barang,
    kategori: b.kategori,
    warna: b.warna,
    lokasi_ditemukan: b.lokasi_ditemukan,
    tanggal_ditemukan: b.tanggal_ditemukan,
    status_publik: b.status_publik as StatusPublik,
    bisa_diklaim: b.status_publik === "tersedia",
    foto_url: urlFotoBarang(supabase, b.foto_path),
  };
}

export type BarangPublik = ReturnType<typeof keBarangPublik>;

export async function cariBarangPublik(filter: FilterBarangPublik, halaman = 1) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cari_barang_publik", {
    p_cari: filter.cari,
    p_kategori: filter.kategori,
    p_limit: PAGE_SIZE,
    p_offset: offsetHalaman(halaman),
  });
  if (error) gagalMemuat("daftar barang", error);

  return {
    barang: data.map((b) => keBarangPublik(supabase, b)),
    ...infoHalaman(data[0]?.total ?? 0, halaman),
  };
}

/** Di-cache per request: dipakai generateMetadata dan halaman sekaligus. */
export const getBarangPublik = cache(async (id: string): Promise<BarangPublik | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("barang_publik_detail", { p_id: id });
  if (error) {
    if (isIdTidakValid(error)) return null;
    gagalMemuat("detail barang", error);
  }
  return data[0] ? keBarangPublik(supabase, data[0]) : null;
});
