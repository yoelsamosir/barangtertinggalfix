import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { TidakBerwenangError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { Supabase } from "@/lib/supabase/types";

/** Identitas petugas yang sedang login. (Login/logout ada di services/auth.ts.) */

export type Petugas = {
  id: string;
  nama: string;
  email: string | null;
};

/** Petugas = akun Supabase Auth yang profilnya berstatus 'aktif'; selain itu null. */
export async function ambilPetugasAktif(
  supabase: Supabase,
  uid: string,
  email: string | null,
): Promise<Petugas | null> {
  const { data } = await supabase.from("profiles").select("id, nama, status").eq("id", uid).maybeSingle();
  return data?.status === "aktif" ? { id: data.id, nama: data.nama, email } : null;
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
