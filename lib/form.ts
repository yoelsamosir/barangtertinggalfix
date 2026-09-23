/** Membaca nilai dari FormData. */

/** Nama field bawaan widget Cloudflare Turnstile. */
const FIELD_TURNSTILE = "cf-turnstile-response";

/**
 * Semua field teks (File diabaikan) — untuk divalidasi skema zod.
 * Token Turnstile disalin ke `captcha_token` agar sama dengan body JSON API.
 */
export function formToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") obj[key] = value;
  }
  if (obj[FIELD_TURNSTILE] && !obj.captcha_token) {
    obj.captcha_token = obj[FIELD_TURNSTILE];
  }
  delete obj[FIELD_TURNSTILE];
  return obj;
}

/** File dari <input type="file">; null bila tidak diisi. */
export function ambilFile(formData: FormData, nama: string): File | null {
  const value = formData.get(nama);
  return value instanceof File && value.size > 0 ? value : null;
}
