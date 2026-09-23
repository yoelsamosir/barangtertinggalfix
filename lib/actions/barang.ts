"use server";

import { ambilFile, formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import * as layanan from "@/lib/services/barang";
import { jalankan } from "./jalankan";

/** Field: nama_barang, kategori, warna, deskripsi, lokasi_ditemukan, tanggal_ditemukan, tampilkan_foto, foto (file) */
export async function tambahBarang(
  _prev: Hasil<{ id: string; kode_barang: string }> | null,
  formData: FormData,
): Promise<Hasil<{ id: string; kode_barang: string }>> {
  return jalankan(() => layanan.tambahBarang(formToObject(formData), ambilFile(formData, "foto")));
}

/** Field: id, (field barang), foto (file, opsional), hapus_foto */
export async function ubahBarang(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.ubahBarang(formToObject(formData), ambilFile(formData, "foto")));
}

/** Field: id */
export async function hapusBarang(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.hapusBarang(formToObject(formData)));
}
