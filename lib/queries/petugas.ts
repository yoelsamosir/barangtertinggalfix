import "server-only";
import { pastikanAdmin } from "@/lib/auth";
import { gagalMemuat } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

/** Data akun petugas — KHUSUS ADMIN (fungsi database juga memeriksa is_admin()). */

export async function daftarPetugas() {
  await pastikanAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("daftar_petugas");
  if (error) gagalMemuat("daftar petugas", error);

  return data;
}

export type BarisPetugas = Awaited<ReturnType<typeof daftarPetugas>>[number];
