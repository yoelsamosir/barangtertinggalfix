import "server-only";
import { revalidatePath } from "next/cache";
import { isAdmin, pastikanPetugas, type Petugas } from "@/lib/auth";
import { PERAN_LABEL, STATUS_AKUN_LABEL } from "@/lib/domain";
import {
  buatAkunPetugas,
  setelPasswordPetugas,
  simpanPeranPetugas,
  simpanStatusPetugas,
} from "@/lib/mutations/petugas";
import { gagal, gagalValidasi, ok, type Gagal, type Hasil } from "@/lib/result";
import { ROUTES } from "@/lib/routes";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  aturPeranPetugasSchema,
  resetPasswordPetugasSchema,
  tambahPetugasSchema,
  ubahStatusPetugasSchema,
} from "@/lib/validation/petugas";

/**
 * Pengelolaan akun petugas — KHUSUS ADMIN.
 * Klien service_role (Auth Admin API) hanya dibuat setelah pemanggil dipastikan admin.
 */

async function cekAdmin(): Promise<Petugas | Gagal> {
  const petugas = await pastikanPetugas();
  return isAdmin(petugas) ? petugas : gagal("akses", "Hanya admin yang dapat mengelola petugas.");
}

const bukanPetugas = (v: Petugas | Gagal): v is Gagal => "ok" in v;

function revalidasiKelolaPetugas() {
  revalidatePath(ROUTES.kelolaPetugas);
}

export async function tambahPetugas(input: unknown): Promise<Hasil<{ id: string }>> {
  const admin = await cekAdmin();
  if (bukanPetugas(admin)) return admin;

  const parsed = tambahPetugasSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);
  const { nama, email, password, peran } = parsed.data;

  const dibuat = await buatAkunPetugas(createAdminClient(), { email, password, nama });
  if (!dibuat.ok) return dibuat;

  revalidasiKelolaPetugas();

  if (peran === "admin") {
    const diatur = await simpanPeranPetugas(await createClient(), dibuat.data.id, "admin");
    if (!diatur.ok) {
      return ok(dibuat.data, `Petugas ${nama} ditambahkan, tetapi gagal dijadikan admin: ${diatur.error}`);
    }
  }

  return ok(dibuat.data, `${PERAN_LABEL[peran]} ${nama} (${email}) berhasil ditambahkan dan sudah bisa login.`);
}

export async function ubahStatusPetugas(input: unknown): Promise<Hasil> {
  const admin = await cekAdmin();
  if (bukanPetugas(admin)) return admin;

  const parsed = ubahStatusPetugasSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const hasil = await simpanStatusPetugas(await createClient(), parsed.data.id, parsed.data.status);
  if (!hasil.ok) return hasil;

  revalidasiKelolaPetugas();
  return ok(undefined, `Status petugas diubah menjadi ${STATUS_AKUN_LABEL[parsed.data.status].toLowerCase()}.`);
}

export async function aturPeranPetugas(input: unknown): Promise<Hasil> {
  const admin = await cekAdmin();
  if (bukanPetugas(admin)) return admin;

  const parsed = aturPeranPetugasSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const hasil = await simpanPeranPetugas(await createClient(), parsed.data.id, parsed.data.peran);
  if (!hasil.ok) return hasil;

  revalidasiKelolaPetugas();
  return ok(undefined, `Peran diubah menjadi ${PERAN_LABEL[parsed.data.peran].toLowerCase()}.`);
}

/** Untuk petugas yang lupa password. Admin mengganti password-nya sendiri lewat menu Profil. */
export async function resetPasswordPetugas(input: unknown): Promise<Hasil> {
  const admin = await cekAdmin();
  if (bukanPetugas(admin)) return admin;

  const parsed = resetPasswordPetugasSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  if (parsed.data.id === admin.id) {
    return gagal("konflik", "Untuk akun Anda sendiri, ganti password lewat menu Profil.");
  }

  const hasil = await setelPasswordPetugas(createAdminClient(), parsed.data.id, parsed.data.password_baru);
  if (!hasil.ok) return hasil;

  return ok(undefined, "Password berhasil direset. Sampaikan password baru kepada petugas yang bersangkutan.");
}
