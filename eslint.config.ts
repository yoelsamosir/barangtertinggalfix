import type { Linter } from "eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Batas lapisan arsitektur (lihat README "Di mana menaruh kode baru").
 * Setiap folder hanya boleh memakai lapisan di bawahnya:
 *
 *   halaman & komponen -> actions (tulis) / queries (baca)
 *   app/api            -> services (tulis) / queries (baca)
 *   actions            -> services
 *   services           -> mutations, storage, security, validation
 *   queries, mutations -> supabase
 */
const LAPISAN = {
  actions: { group: ["@/lib/actions/*"], message: "Server Action hanya dipanggil dari halaman/komponen." },
  services: {
    group: ["@/lib/services/*"],
    message: "Halaman & komponen menulis data lewat lib/actions, bukan langsung ke services.",
  },
  mutations: { group: ["@/lib/mutations/*"], message: "Penulisan database hanya dari lib/services." },
  queries: { group: ["@/lib/queries/*"], message: "Lapisan ini tidak boleh membaca data lewat lib/queries." },
  storage: { group: ["@/lib/storage/*"], message: "Pengolahan file hanya dari lib/services / lib/queries." },
  security: { group: ["@/lib/security/*"], message: "Rate limit & captcha hanya dijalankan di lib/services." },
  admin: { group: ["@/lib/supabase/admin"], message: "Klien service_role hanya boleh dipakai lib/services." },
  supabase: {
    group: ["@/lib/supabase/server", "@/lib/supabase/client"],
    message: "Akses Supabase hanya lewat lib/queries atau lib/services.",
  },
  api: { group: ["@/lib/api/*"], message: "Helper REST hanya untuk app/api." },
};

type Lapisan = keyof typeof LAPISAN;

/** Folder `files` dilarang mengimpor lapisan yang disebut. */
const larang = (files: string[], ...lapisan: Lapisan[]): Linter.Config => ({
  files,
  rules: { "no-restricted-imports": ["error", { patterns: lapisan.map((l) => LAPISAN[l]) }] },
});

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Urutan penting: aturan untuk app/api menimpa aturan umum app/**.
  larang(["app/**", "components/**"], "services", "mutations", "storage", "security", "admin", "supabase", "api"),
  larang(["app/api/**"], "actions", "mutations", "storage", "security", "admin", "supabase"),
  larang(["lib/actions/**"], "mutations", "queries", "storage", "security", "admin", "supabase", "api"),
  larang(["lib/services/**"], "actions", "api"),
  larang(["lib/queries/**"], "actions", "services", "mutations", "security", "admin", "api"),
  larang(["lib/mutations/**"], "actions", "services", "queries", "security", "admin", "api"),
  larang(
    ["lib/validation/**"],
    "actions",
    "services",
    "mutations",
    "queries",
    "storage",
    "security",
    "admin",
    "supabase",
    "api",
  ),
]);
