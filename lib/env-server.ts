import "server-only";
import { z } from "zod";

/**
 * Variabel rahasia — hanya di server, TIDAK boleh berawalan NEXT_PUBLIC_.
 * Dibaca saat pertama dipakai (bukan saat build) dan divalidasi.
 */
const schema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY belum diisi."),
  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY belum diisi."),
  IP_HASH_SECRET: z.string().min(32, "IP_HASH_SECRET minimal 32 karakter acak."),
});

let cache: z.infer<typeof schema> | null = null;

export function envServer() {
  if (!cache) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Konfigurasi server tidak lengkap: ${parsed.error.issues.map((i) => i.message).join(" ")}`);
    }
    cache = parsed.data;
  }
  return cache;
}
