import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { gagalMemuat, isIdTidakValid } from "@/lib/errors";
import { infoHalaman, rentangHalaman } from "@/lib/pagination";
import { urlSementaraBukti } from "@/lib/storage/bukti-serah-terima";
import { createClient } from "@/lib/supabase/server";
import { akhirHariWIB, awalHariWIB } from "@/lib/utils/tanggal";
import type { FilterPengembalian } from "@/lib/validation/pengembalian";

/** Riwayat & detail pengembalian untuk petugas. */

export async function daftarPengembalian(filter: FilterPengembalian, halaman = 1) {
  await pastikanPetugas();
  const supabase = await createClient();

  let query = supabase
    .from("returns")
    .select(
      `id, tanggal_pengembalian,
       klaim:claims!returns_claim_id_fkey(id, nomor_klaim, nama_pengklaim),
       barang:items!returns_item_id_fkey(id, kode_barang, nama_barang),
       petugas:profiles!returns_petugas_id_fkey(nama)`,
      { count: "exact" },
    )
    .order("tanggal_pengembalian", { ascending: false })
    .range(...rentangHalaman(halaman));

  if (filter.dari) query = query.gte("tanggal_pengembalian", awalHariWIB(filter.dari));
  if (filter.sampai) query = query.lte("tanggal_pengembalian", akhirHariWIB(filter.sampai));

  const { data, error, count } = await query;
  if (error) gagalMemuat("riwayat pengembalian", error);

  return { pengembalian: data, ...infoHalaman(count, halaman) };
}

/** Detail pengembalian + URL sementara foto bukti (bucket privat). */
export async function getPengembalian(id: string) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("returns")
    .select(
      `*,
       klaim:claims!returns_claim_id_fkey(id, nomor_klaim, nama_pengklaim, no_hp, ciri_barang),
       barang:items!returns_item_id_fkey(id, kode_barang, nama_barang, kategori, warna),
       petugas:profiles!returns_petugas_id_fkey(nama)`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isIdTidakValid(error)) return null;
    gagalMemuat("detail pengembalian", error);
  }
  if (!data) return null;

  return { ...data, foto_url: await urlSementaraBukti(supabase, data.foto_serah_terima) };
}
