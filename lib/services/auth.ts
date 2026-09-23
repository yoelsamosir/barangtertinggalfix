import "server-only";
import { ambilPetugasAktif, type Petugas } from "@/lib/auth";
import { gagal, gagalValidasi, ok, type Hasil } from "@/lib/result";
import { ipKlien } from "@/lib/security/ip-klien";
import { ATURAN, batasi } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";

/**
 * Login petugas.
 * Lapisan: rate limit per IP & per email -> captcha (dicek Supabase Auth)
 * -> password -> profil harus 'aktif'.
 */
export async function login(input: unknown): Promise<Hasil<Petugas>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);
  const { email, password, captcha_token } = parsed.data;

  const perIp = await batasi(ATURAN.loginPerIp, await ipKlien());
  if (!perIp.ok) return perIp;
  const perEmail = await batasi(ATURAN.loginPerEmail, email);
  if (!perEmail.ok) return perEmail;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: captcha_token },
  });

  if (error?.code === "captcha_failed") {
    return gagal("captcha", "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.");
  }
  if (error || !data.user) {
    // Pesan generik: jangan bocorkan apakah email terdaftar.
    return gagal("validasi", "Email atau password salah.");
  }

  const petugas = await ambilPetugasAktif(supabase, data.user.id, data.user.email ?? null);
  if (!petugas) {
    await supabase.auth.signOut();
    return gagal("akses", "Akun petugas tidak aktif. Hubungi admin.");
  }

  return ok(petugas, "Login berhasil.");
}

/** Keluar dan cabut sesi. */
export async function logout(): Promise<Hasil> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return ok(undefined, "Anda telah keluar.");
}
