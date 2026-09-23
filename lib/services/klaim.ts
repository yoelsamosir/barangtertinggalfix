import "server-only";
import { pastikanPetugas } from "@/lib/auth";
import { buatKlaim, simpanKeputusanKlaim } from "@/lib/mutations/klaim";
import { gagalValidasi, ok, type Hasil } from "@/lib/result";
import { revalidasiDashboard, revalidasiSemua } from "@/lib/revalidate";
import { ipKlien } from "@/lib/security/ip-klien";
import { ATURAN, batasi } from "@/lib/security/rate-limit";
import { verifikasiTurnstile } from "@/lib/security/turnstile";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ajukanKlaimSchema, verifikasiKlaimSchema } from "@/lib/validation/klaim";

/**
 * PUBLIK — pengunjung mengajukan klaim (tanpa login).
 * Lapisan: validasi -> rate limit per IP -> Turnstile -> fungsi database.
 * Disimpan dengan klien service_role karena ajukan_klaim tertutup untuk anon.
 */
export async function ajukanKlaim(input: unknown): Promise<Hasil<{ nomor_klaim: string }>> {
  const parsed = ajukanKlaimSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const ip = await ipKlien();

  const kuota = await batasi(ATURAN.klaimPerIp, ip);
  if (!kuota.ok) return kuota;

  const captcha = await verifikasiTurnstile(parsed.data.captcha_token, ip);
  if (!captcha.ok) return captcha;

  const hasil = await buatKlaim(createAdminClient(), parsed.data);
  if (!hasil.ok) return hasil;

  revalidasiDashboard();
  return ok(
    { nomor_klaim: hasil.data },
    "Klaim berhasil diajukan. Silakan menunggu proses verifikasi oleh petugas.",
  );
}

/**
 * PETUGAS — setujui atau tolak klaim.
 * 'tolak' juga membatalkan klaim yang sudah disetujui (pemilik tidak datang).
 */
export async function verifikasiKlaim(input: unknown): Promise<Hasil> {
  await pastikanPetugas();

  const parsed = verifikasiKlaimSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);

  const hasil = await simpanKeputusanKlaim(await createClient(), parsed.data);
  if (!hasil.ok) return hasil;

  revalidasiSemua();
  return ok(undefined, parsed.data.keputusan === "setujui" ? "Klaim disetujui." : "Klaim ditolak.");
}
