import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { gagalMemuat, isIdTidakValid } from "@/lib/errors";
import { infoHalaman, rentangHalaman } from "@/lib/pagination";
import { urlFotoBarang } from "@/lib/storage/foto-barang";
import { filterCari } from "@/lib/supabase/filter";
import { createClient } from "@/lib/supabase/server";
import type { FilterKlaim } from "@/lib/validation/klaim";

/** Data klaim untuk petugas. */

const KOLOM_CARI = ["nomor_klaim", "nama_pengklaim"] as const;

export const KOLOM_KLAIM_RINGKAS = `
  id, nomor_klaim, nama_pengklaim, status, created_at,
  barang:items!claims_item_id_fkey(id, kode_barang, nama_barang)
`;

export async function daftarKlaim(filter: FilterKlaim, halaman = 1) {
  await pastikanPetugas();
  const supabase = await createClient();

  let query = supabase
    .from("claims")
    .select(KOLOM_KLAIM_RINGKAS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(...rentangHalaman(halaman));

  if (filter.status) query = query.eq("status", filter.status);

  const cari = filterCari(KOLOM_CARI, filter.cari);
  if (cari) query = query.or(cari);

  const { data, error, count } = await query;
  if (error) gagalMemuat("daftar klaim", error);

  return { klaim: data, ...infoHalaman(count, halaman) };
}

/**
 * Detail klaim beserta data barang LENGKAP (termasuk deskripsi internal)
 * agar petugas bisa mencocokkan ciri-ciri saat verifikasi.
 */
export async function getKlaim(id: string) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .select(
      `*,
       barang:items!claims_item_id_fkey(*),
       verifikator:profiles!claims_diverifikasi_oleh_fkey(nama),
       pengembalian:returns!returns_claim_id_fkey(id, tanggal_pengembalian)`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isIdTidakValid(error)) return null;
    gagalMemuat("detail klaim", error);
  }
  if (!data) return null;

  return {
    ...data,
    barang: { ...data.barang, foto_url: urlFotoBarang(supabase, data.barang.foto_path) },
  };
}
