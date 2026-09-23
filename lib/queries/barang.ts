import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { gagalMemuat, isIdTidakValid } from "@/lib/errors";
import { infoHalaman, rentangHalaman } from "@/lib/pagination";
import { urlFotoBarang } from "@/lib/storage/foto-barang";
import { filterCari } from "@/lib/supabase/filter";
import { createClient } from "@/lib/supabase/server";
import type { FilterBarang } from "@/lib/validation/barang";

/** Data barang untuk petugas (termasuk deskripsi internal). */

const KOLOM_CARI = ["kode_barang", "nama_barang", "warna", "lokasi_ditemukan"] as const;

export async function daftarBarang(filter: FilterBarang, halaman = 1) {
  await pastikanPetugas();
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select(
      "id, kode_barang, nama_barang, kategori, warna, lokasi_ditemukan, tanggal_ditemukan, foto_path, status, created_at",
      { count: "exact" },
    )
    .order("tanggal_ditemukan", { ascending: false })
    .order("created_at", { ascending: false })
    .range(...rentangHalaman(halaman));

  if (filter.kategori) query = query.eq("kategori", filter.kategori);
  if (filter.status) query = query.eq("status", filter.status);

  const cari = filterCari(KOLOM_CARI, filter.cari);
  if (cari) query = query.or(cari);

  const { data, error, count } = await query;
  if (error) gagalMemuat("daftar barang", error);

  return {
    barang: data.map((b) => ({ ...b, foto_url: urlFotoBarang(supabase, b.foto_path) })),
    ...infoHalaman(count, halaman),
  };
}

/** Detail barang beserta pencatat dan riwayat klaimnya. */
export async function getBarang(id: string) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select(
      `*,
       pencatat:profiles!items_dicatat_oleh_fkey(nama),
       klaim:claims(id, nomor_klaim, nama_pengklaim, status, created_at)`,
    )
    .eq("id", id)
    .order("created_at", { referencedTable: "claims", ascending: false })
    .maybeSingle();

  if (error) {
    if (isIdTidakValid(error)) return null;
    gagalMemuat("detail barang", error);
  }
  if (!data) return null;

  return { ...data, foto_url: urlFotoBarang(supabase, data.foto_path) };
}
