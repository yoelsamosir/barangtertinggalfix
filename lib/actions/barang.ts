"use server";

import { redirect } from "next/navigation";
import { ambilFile, formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import { denganInfo, ROUTES } from "@/lib/routes";
import * as layanan from "@/lib/services/barang";
import { jalankan } from "./jalankan";

/**
 * Field: nama_barang, kategori, warna, deskripsi, lokasi_ditemukan, tanggal_ditemukan, tampilkan_foto, foto (file).
 * Berhasil -> ke detail barang baru.
 */
export async function tambahBarang(
  _prev: Hasil<{ id: string; kode_barang: string }> | null,
  formData: FormData,
): Promise<Hasil<{ id: string; kode_barang: string }>> {
  const hasil = await jalankan(() => layanan.tambahBarang(formToObject(formData), ambilFile(formData, "foto")));
  if (hasil.ok) redirect(denganInfo(ROUTES.barangDetail(hasil.data.id), "baru"));
  return hasil;
}

/** Field: id, (field barang), foto (file, opsional), hapus_foto. Berhasil -> ke detail barang. */
export async function ubahBarang(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  const hasil = await jalankan(() => layanan.ubahBarang(formToObject(formData), ambilFile(formData, "foto")));
  if (hasil.ok) redirect(denganInfo(ROUTES.barangDetail(String(formData.get("id"))), "diubah"));
  return hasil;
}

/** Field: id. Berhasil -> ke daftar barang. */
export async function hapusBarang(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  const hasil = await jalankan(() => layanan.hapusBarang(formToObject(formData)));
  if (hasil.ok) redirect(denganInfo(ROUTES.barang, "dihapus"));
  return hasil;
}
