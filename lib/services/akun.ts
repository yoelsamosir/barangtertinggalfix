import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { MASA_TOKEN_MENIT } from "@/lib/config";
import { cocokkanPasswordLama, keluarkanSesiLain, perbaruiNamaProfil, simpanPasswordBaru } from "@/lib/mutations/akun";
import { gagalValidasi, ok, type Hasil } from "@/lib/result";
import { revalidasiDashboard } from "@/lib/revalidate";
import { createClient } from "@/lib/supabase/server";
import { gantiPasswordSchema, ubahProfilSchema } from "@/lib/validation/akun";

/** Pengelolaan akun oleh petugas itu sendiri. */

export async function ubahProfil(input: unknown): Promise<Hasil> {
  const petugas = await pastikanPetugas();

  const parsed = ubahProfilSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const hasil = await perbaruiNamaProfil(await createClient(), petugas.id, parsed.data.nama);
  if (!hasil.ok) return hasil;

  revalidasiDashboard();
  return ok(undefined, "Profil berhasil diperbarui.");
}

/**
 * Wajib password lama (dibatasi 5 percobaan / 15 menit oleh database).
 * Setelah berhasil, sesi di perangkat lain dicabut (mis. bila password diganti karena bocor).
 * Catatan: yang dicabut adalah refresh token; token akses yang sudah terbit tetap sah
 * sampai kedaluwarsa (MASA_TOKEN_MENIT), jadi perangkat lain keluar paling lambat selama itu.
 */
export async function gantiPassword(input: unknown): Promise<Hasil> {
  await pastikanPetugas();

  const parsed = gantiPasswordSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const supabase = await createClient();

  const cocok = await cocokkanPasswordLama(supabase, parsed.data.password_lama);
  if (!cocok.ok) return cocok;

  const hasil = await simpanPasswordBaru(supabase, parsed.data.password_baru);
  if (!hasil.ok) return hasil;

  await keluarkanSesiLain(supabase);
  return ok(
    undefined,
    `Password berhasil diganti. Perangkat lain yang login dengan akun ini akan keluar otomatis paling lambat ${MASA_TOKEN_MENIT} menit lagi.`,
  );
}
