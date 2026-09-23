import { z } from "zod";
import { ITEM_STATUS, KATEGORI } from "@/lib/domain";
import { checkbox, filterOpsional, kataKunci, tanggalLampau, teksOpsional, teksWajib, uuid } from "./common";

/**
 * Form barang petugas. Tidak ada field status: barang baru selalu
 * 'tersimpan', perubahan status hanya lewat alur klaim & pengembalian.
 * Foto dikirim sebagai File terpisah (field "foto").
 */
export const barangSchema = z.object({
  nama_barang: teksWajib("Nama barang", 100),
  kategori: z.enum(KATEGORI, { error: "Kategori tidak valid." }),
  warna: teksOpsional("Warna", 50),
  deskripsi: teksOpsional("Deskripsi", 2000),
  lokasi_ditemukan: teksWajib("Lokasi ditemukan", 150),
  tanggal_ditemukan: tanggalLampau("Tanggal ditemukan"),
  tampilkan_foto: checkbox,
});

export const ubahBarangSchema = barangSchema.extend({
  id: uuid("ID barang"),
  hapus_foto: checkbox,
});

export const hapusBarangSchema = z.object({
  id: uuid("ID barang"),
});

/** Filter daftar barang di dashboard. */
export const filterBarangSchema = z.object({
  cari: kataKunci,
  kategori: filterOpsional(z.enum(KATEGORI)),
  status: filterOpsional(z.enum(ITEM_STATUS)),
});

/** Filter pencarian di halaman publik. */
export const filterBarangPublikSchema = filterBarangSchema.omit({ status: true });

export type BarangInput = z.infer<typeof barangSchema>;
export type FilterBarang = z.infer<typeof filterBarangSchema>;
export type FilterBarangPublik = z.infer<typeof filterBarangPublikSchema>;
