import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import type { ItemKategori } from "@/lib/domain";
import { gagalMemuat } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { FilterLaporan } from "@/lib/validation/laporan";

/** Laporan untuk petugas. */

/**
 * Ringkasan untuk barang yang DITEMUKAN pada periode/filter tertentu,
 * beserta status klaim atas barang-barang tersebut.
 */
export async function laporanRingkasan(filter: FilterLaporan) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("laporan_ringkasan", {
      p_dari: filter.dari,
      p_sampai: filter.sampai,
      p_kategori: filter.kategori,
      p_lokasi: filter.lokasi,
    })
    .single();
  if (error) gagalMemuat("laporan", error);

  return data;
}

/** Data grafik: jumlah barang ditemukan & dikembalikan per bulan (12 baris). */
export async function laporanPerBulan(tahun: number, kategori?: ItemKategori) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("laporan_per_bulan", { p_tahun: tahun, p_kategori: kategori });
  if (error) gagalMemuat("grafik laporan", error);

  return data;
}
