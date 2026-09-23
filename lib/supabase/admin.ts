import "server-only";
import { createClient } from "@supabase/supabase-js";
import { envServer } from "@/lib/env-server";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./env";
import type { Supabase } from "./types";

/**
 * Klien service_role — MELEWATI RLS. Hanya boleh dipakai untuk operasi yang
 * memang khusus server dan sudah dijaga aplikasi:
 *   - ajukan_klaim (setelah Turnstile & rate limit)  -> lib/mutations/klaim.ts
 *   - pakai_kuota  (rate limit)                        -> lib/security/rate-limit.ts
 * Jangan dipakai untuk membaca/menulis data petugas.
 */
export function createAdminClient(): Supabase {
  return createClient<Database>(SUPABASE_URL, envServer().SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
