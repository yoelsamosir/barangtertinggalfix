import "server-only";
import { gagalDb } from "@/lib/errors";
import { gagal, ok, type Hasil } from "@/lib/result";
import type { Supabase } from "@/lib/supabase/types";

/** Operasi tulis data akun petugas yang sedang login. */

export async function perbaruiNamaProfil(supabase: Supabase, uid: string, nama: string): Promise<Hasil> {
  const { error } = await supabase.from("profiles").update({ nama }).eq("id", uid);

  if (error) return gagalDb(error, "Gagal memperbarui profil.");
  return ok();
}

/** Dibatasi 5 percobaan / 15 menit per akun oleh database. */
export async function cocokkanPasswordLama(supabase: Supabase, password: string): Promise<Hasil> {
  const { data: cocok, error } = await supabase.rpc("cek_password_sendiri", { p_password: password });

  if (error) return gagalDb(error);
  return cocok ? ok() : gagal("validasi", "Password lama salah.", { password_lama: ["Password lama salah."] });
}

export async function simpanPasswordBaru(supabase: Supabase, password: string): Promise<Hasil> {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[auth] ganti password", error);
    return gagal("server", "Gagal mengganti password. Silakan coba lagi.");
  }
  return ok();
}
