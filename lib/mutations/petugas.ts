import "server-only";
import type { PeranPetugas, StatusAkun } from "@/lib/domain";
import { gagalDb } from "@/lib/errors";
import { gagal, ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";

/**
 * Operasi tulis akun petugas oleh admin.
 * - `admin`: klien service_role (Auth Admin API) — dibuat oleh services SETELAH memastikan pemanggil admin.
 * - `supabase`: klien sesi admin — fungsi database memeriksa is_admin() sendiri.
 */

type AuthError = { code?: string; status?: number; message?: string };

/** Akun langsung terkonfirmasi; profil (nama dari metadata) dibuat trigger on_auth_user_created. */
export async function buatAkunPetugas(
  admin: Supabase,
  akun: { email: string; password: string; nama: string },
): Promise<Hasil<{ id: string }>> {
  const { data, error } = await admin.auth.admin.createUser({
    email: akun.email,
    password: akun.password,
    email_confirm: true,
    user_metadata: { nama: akun.nama },
  });

  if (error) return gagalAuth(error, "Gagal menambah petugas.");
  return ok({ id: data.user.id });
}

export async function setelPasswordPetugas(admin: Supabase, id: string, password: string): Promise<Hasil> {
  const { error } = await admin.auth.admin.updateUserById(id, { password });

  if (error) return gagalAuth(error, "Gagal mereset password.");
  return ok();
}

export async function simpanStatusPetugas(supabase: Supabase, id: string, status: StatusAkun): Promise<Hasil> {
  const { error } = await supabase.rpc("ubah_status_petugas", { p_id: id, p_status: status });

  if (error) return gagalDb(error, "Gagal mengubah status petugas.");
  return ok();
}

export async function simpanPeranPetugas(supabase: Supabase, id: string, peran: PeranPetugas): Promise<Hasil> {
  const { error } = await supabase.rpc("atur_peran_petugas", { p_id: id, p_peran: peran });

  if (error) return gagalDb(error, "Gagal mengubah peran petugas.");
  return ok();
}

function gagalAuth(error: AuthError, fallback: string) {
  if (error.code === "email_exists" || error.code === "user_already_exists") {
    return gagal("konflik", "Email sudah terdaftar.", { email: ["Email sudah terdaftar."] });
  }
  if (error.code === "user_not_found") return gagal("tidak_ditemukan", "Petugas tidak ditemukan.");
  if (error.code === "weak_password") {
    return gagal("validasi", "Password terlalu lemah.", { password: ["Password terlalu lemah."] });
  }
  console.error("[auth] kelola petugas", error);
  return gagal("server", fallback);
}
