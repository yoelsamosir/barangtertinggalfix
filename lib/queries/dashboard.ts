import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { gagalMemuat } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { jumlahKlaimMenunggu, KOLOM_KLAIM_RINGKAS } from "./klaim";

/** Ringkasan untuk halaman utama dashboard petugas. */

export async function statistikDashboard() {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("statistik_dashboard").single();
  if (error) gagalMemuat("statistik", error);

  return data;
}

/** Klaim yang masih menunggu verifikasi, terbaru di atas. */
export async function klaimMenungguTerbaru(jumlah = 5) {
  await pastikanPetugas();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .select(KOLOM_KLAIM_RINGKAS)
    .eq("status", "menunggu")
    .order("created_at", { ascending: false })
    .limit(jumlah);
  if (error) gagalMemuat("klaim terbaru", error);

  return data;
}

/** Untuk notifikasi klaim baru di halaman petugas: jumlah menunggu + satu klaim paling baru. */
export async function ringkasanKlaimMenunggu() {
  const [jumlah, terbaru] = await Promise.all([jumlahKlaimMenunggu(), klaimMenungguTerbaru(1)]);
  return { jumlah, terbaru: terbaru[0] ?? null };
}

export type RingkasanKlaimMenunggu = Awaited<ReturnType<typeof ringkasanKlaimMenunggu>>;
