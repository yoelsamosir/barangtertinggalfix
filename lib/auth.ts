import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { PeranPetugas } from "@/lib/domain";
import { AksesDitolakError, TidakBerwenangError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { Supabase } from "@/lib/supabase/types";

/** Identitas petugas yang sedang login. (Login/logout ada di services/auth.ts.) */

export type Petugas = {
  id: string;
  nama: string;
  email: string | null;
  peran: PeranPetugas;
};

/** Petugas = akun Supabase Auth yang profilnya berstatus 'aktif'; selain itu null. */
export async function ambilPetugasAktif(
  supabase: Supabase,
  uid: string,
  email: string | null,
): Promise<Petugas | null> {
  const { data } = await supabase.from("profiles").select("id, nama, status, peran").eq("id", uid).maybeSingle();
  return data?.status === "aktif"
    ? { id: data.id, nama: data.nama, email, peran: data.peran === "admin" ? "admin" : "petugas" }
    : null;
}

/** Petugas yang sedang login, atau null. Di-cache per request. */
export const getPetugas = cache(async (): Promise<Petugas | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims(); // memverifikasi JWT
  const uid = data?.claims?.sub;
  if (error || !uid) return null;

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  return ambilPetugasAktif(supabase, uid, email);
});

/** Untuk services & queries: lempar TidakBerwenangError bila bukan petugas aktif. */
export async function pastikanPetugas(): Promise<Petugas> {
  const petugas = await getPetugas();
  if (!petugas) throw new TidakBerwenangError();
  return petugas;
}

/** Untuk halaman (Server Component): arahkan ke /login bila bukan petugas aktif. */
export async function requirePetugas(): Promise<Petugas> {
  const petugas = await getPetugas();
  if (!petugas) redirect(ROUTES.login);
  return petugas;
}

export function isAdmin(petugas: Petugas): boolean {
  return petugas.peran === "admin";
}

/** Untuk queries: lempar TidakBerwenangError / AksesDitolakError bila bukan admin aktif. */
export async function pastikanAdmin(): Promise<Petugas> {
  const petugas = await pastikanPetugas();
  if (!isAdmin(petugas)) throw new AksesDitolakError();
  return petugas;
}

/** Untuk halaman khusus admin: petugas biasa dikembalikan ke dashboard. */
export async function requireAdmin(): Promise<Petugas> {
  const petugas = await requirePetugas();
  if (!isAdmin(petugas)) redirect(ROUTES.dashboard);
  return petugas;
}
