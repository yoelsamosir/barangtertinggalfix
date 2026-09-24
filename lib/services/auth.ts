import "server-only";
import { ambilPetugasAktif, type Petugas } from "@/lib/auth";
import { gagal, gagalValidasi, ok, type Hasil } from "@/lib/result";
import { ipKlien } from "@/lib/security/ip-klien";
import { ATURAN, batasi, cekKuota } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";

/**
 * Login petugas.
 * Lapisan: rate limit per IP -> kuota gagal per email -> captcha (dicek
 * Supabase Auth) -> password -> profil harus 'aktif'.
 *
 * Kuota per email hanya berkurang untuk password salah SETELAH captcha lolos,
 * sehingga orang tanpa captcha tidak bisa mengunci akun petugas.
 */
export async function login(input: unknown): Promise<Hasil<Petugas>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return gagalValidasi(parsed.error);
  const { email, password, captcha_token } = parsed.data;

  const perIp = await batasi(ATURAN.loginPerIp, await ipKlien());
  if (!perIp.ok) return perIp;
  const perEmail = await cekKuota(ATURAN.loginGagalPerEmail, email);
  if (!perEmail.ok) return perEmail;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: captcha_token },
  });

  if (error) return tanganiErrorLogin(error, email);

  const petugas = await ambilPetugasAktif(supabase, data.user.id, data.user.email ?? null);
  if (!petugas) {
    await supabase.auth.signOut({ scope: "local" });
    return gagal("akses", "Akun petugas tidak aktif. Hubungi admin.");
  }

  return ok(petugas, "Login berhasil.");
}

/** Keluar dari perangkat ini saja (sesi di perangkat lain tetap). */
export async function logout(): Promise<Hasil> {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  return ok(undefined, "Anda telah keluar.");
}

async function tanganiErrorLogin(error: { code?: string; status?: number }, email: string): Promise<Hasil<never>> {
  if (error.code === "captcha_failed") {
    return gagal("captcha", "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.");
  }
  if (error.code === "invalid_credentials") {
    await batasi(ATURAN.loginGagalPerEmail, email);
    // Pesan generik: jangan bocorkan apakah email terdaftar.
    return gagal("validasi", "Email atau password salah.");
  }
  if (error.status === 429) {
    return gagal("batas", "Terlalu banyak percobaan login. Silakan coba lagi beberapa menit lagi.");
  }
  console.error("[auth] login", error);
  return gagal("server", "Login sedang tidak dapat diproses. Silakan coba lagi.");
}
