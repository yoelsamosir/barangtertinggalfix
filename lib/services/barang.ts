import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { ambilFotoPathBarang, buatBarang, hapusBarangTersimpan, perbaruiBarang } from "@/lib/mutations/barang";
import { gagalValidasi, ok, padaField, type Hasil } from "@/lib/result";
import { revalidasiBarang } from "@/lib/revalidate";
import { hapusFotoBarang, unggahFotoBarang } from "@/lib/storage/foto-barang";
import { createClient } from "@/lib/supabase/server";
import { barangSchema, hapusBarangSchema, ubahBarangSchema } from "@/lib/validation/barang";

/**
 * Use case barang (petugas). Urutan: akses -> validasi -> foto -> database -> refresh.
 * Bila database gagal, foto yang terlanjur diunggah dihapus lagi.
 */

export async function tambahBarang(
  input: unknown,
  foto: File | null,
): Promise<Hasil<{ id: string; kode_barang: string }>> {
  await pastikanPetugas();

  const parsed = barangSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const supabase = await createClient();

  const unggahan = await unggahFotoBarang(supabase, foto);
  if (!unggahan.ok) return padaField(unggahan, "foto");

  const hasil = await buatBarang(supabase, { ...parsed.data, foto_path: unggahan.data });
  if (!hasil.ok) {
    await hapusFotoBarang(supabase, unggahan.data);
    return hasil;
  }

  revalidasiBarang(hasil.data.id);
  return ok(hasil.data, `Barang ${hasil.data.kode_barang} berhasil disimpan.`);
}

/** `hapus_foto` = hapus foto lama tanpa mengganti. Foto baru selalu menggantikan yang lama. */
export async function ubahBarang(input: unknown, foto: File | null): Promise<Hasil> {
  await pastikanPetugas();

  const parsed = ubahBarangSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);
  const { id, hapus_foto, ...barang } = parsed.data;

  const supabase = await createClient();

  const fotoLama = await ambilFotoPathBarang(supabase, id);
  if (!fotoLama.ok) return fotoLama;

  const fotoBaru = await unggahFotoBarang(supabase, foto);
  if (!fotoBaru.ok) return padaField(fotoBaru, "foto");

  const fotoDipakai = fotoBaru.data ?? (hapus_foto ? null : fotoLama.data);

  const hasil = await perbaruiBarang(supabase, id, { ...barang, foto_path: fotoDipakai });
  if (!hasil.ok) {
    await hapusFotoBarang(supabase, fotoBaru.data);
    return hasil;
  }

  if (fotoLama.data !== fotoDipakai) await hapusFotoBarang(supabase, fotoLama.data);

  revalidasiBarang(id);
  return ok(undefined, "Data barang berhasil diperbarui.");
}

/** Hanya barang berstatus 'tersimpan' dan belum pernah diklaim. */
export async function hapusBarang(input: unknown): Promise<Hasil> {
  await pastikanPetugas();

  const parsed = hapusBarangSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const supabase = await createClient();

  const hasil = await hapusBarangTersimpan(supabase, parsed.data.id);
  if (!hasil.ok) return hasil;

  await hapusFotoBarang(supabase, hasil.data);

  revalidasiBarang(parsed.data.id);
  return ok(undefined, "Barang berhasil dihapus.");
}
