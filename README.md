# Sistem Informasi Barang Tertinggal — Balai Perpustakaan DPAD DIY

Next.js 16 (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, Storage).
Dokumentasi endpoint: [docs/API.md](docs/API.md).

## Arsitektur backend

Setiap folder punya satu tugas. Alur sebuah request:

```
Browser / Postman
  │
  ├─ proxy.ts ─────────── CSP ber-nonce, tolak CSRF /api, 401 /api/petugas, redirect halaman
  │
  ├─ app/api/**/route.ts ─┐   ADAPTER (kulit tipis): baca request -> panggil -> tulis response
  ├─ lib/actions/*        ─┘
  │
  ├─ lib/services/*  ──── USE CASE: cek akses -> validasi -> rate limit/captcha -> file -> DB -> refresh
  ├─ lib/queries/*   ──── BACA data (cek akses petugas di sini)
  │
  ├─ lib/mutations/* ──── TULIS ke database saja
  ├─ lib/storage/*   ──── file di Supabase Storage + validasi foto
  ├─ lib/security/*  ──── rate limit, Turnstile, CSP, origin, IP klien
  │
  └─ Supabase ─────────── RLS + fungsi database (aturan bisnis & lapisan keamanan terakhir)
```

```
supabase/migrations/
  01_skema            tipe, tabel, relasi, indeks (tanpa logika)
  02_otomasi          penomoran BLG/CLM & trigger integritas
  03_akses            is_petugas, RLS tabel, bucket & policy Storage
  04_fungsi_publik    cari/detail barang publik, ajukan klaim (khusus server)
  05_fungsi_petugas   verifikasi klaim, proses pengembalian
  06_fungsi_laporan   statistik dashboard & laporan
  07_rate_limit       tabel & fungsi pembatas percobaan
  08_akun             cek password lama
  09_perbaikan_keamanan  cek kuota tanpa memakai (anti kunci akun), foto bukti wajib di folder klaimnya
supabase/seed.sql     data contoh (lokal saja)
supabase/tests/       tes pgTAP (39 tes alur + keamanan)

app/api/              REST API (lihat docs/API.md)
lib/
  services/     use case: auth, akun, barang, klaim, pengembalian
  queries/      baca data: publik, barang, klaim, pengembalian, dashboard, laporan
  mutations/    tulis database: barang, klaim, pengembalian, akun
  actions/      Server Action untuk form UI (+ jalankan.ts: sesi habis -> /login)
  api/          helper REST: baca body/query, tulis response & status HTTP
  security/     rate-limit, turnstile, csp, origin, ip-klien
  storage/      foto-barang (publik), bukti-serah-terima (privat), validasi-foto
  validation/   skema zod per domain
  supabase/     klien browser/server/admin, sesi proxy, filter, tipe hasil generate
  auth.ts       identitas petugas: getPetugas, pastikanPetugas (lempar), requirePetugas (redirect)
  result.ts     bentuk hasil semua operasi { ok, data } | { ok:false, jenis, error }
  errors.ts     error database -> pesan & jenis
  env-server.ts variabel rahasia (divalidasi)
  revalidate.ts, routes.ts, domain.ts, config.ts, pagination.ts, form.ts, utils/
```

### Peran
| Peran | Masuk lewat | Akses |
|---|---|---|
| Pengunjung | tanpa login | cari & lihat barang (kolom aman), ajukan klaim |
| Petugas aktif | email + password + captcha | semua fitur petugas, setara satu sama lain |
| Petugas nonaktif | — | ditolak saat login; sesi lama langsung tidak bisa membaca data |
| Pengelola akun | Dashboard Supabase | buat / nonaktifkan / reset password petugas |

### Lapisan keamanan
1. **proxy.ts** — CSP ber-nonce, tolak request lintas situs ke `/api`, 401/redirect bila belum login.
2. **Header** — `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (kamera hanya situs ini), HSTS.
3. **Services/queries** — `pastikanPetugas()` di setiap operasi petugas; validasi zod semua input.
4. **Anti-spam** — Cloudflare Turnstile (klaim & login) + rate limit di database (IP/email di-hash).
5. **Database** — RLS & hak eksekusi fungsi; status hanya berubah lewat fungsi alur;
   `ajukan_klaim` hanya bisa dipanggil server (anon key publik tidak bisa melewati captcha).
6. **Storage** — foto bukti di bucket privat, signed URL 5 menit, tidak bisa dihapus setelah tercatat.

## Menjalankan lokal

Butuh Node.js 20+ dan Docker Desktop.

> **Simpan proyek di drive NTFS** (mis. `C:\proyek\`). Di drive FAT32/exFAT, `npm run build` gagal
> (tidak mendukung symlink yang dipakai Next.js untuk `sharp`) dan git menolak repo (*dubious ownership*).
> Cek format drive: `Get-Volume -DriveLetter D`.

```bash
npm install
npm run db:start            # Supabase lokal (migrasi + seed otomatis)
cp .env.example .env.local  # isi kunci dari `npx supabase status`; kunci Turnstile uji sudah terisi
npm run dev
```

Login petugas lokal: `petugas@dpad.test` / `petugas123` (captcha lokal memakai kunci uji Cloudflare yang selalu lolos).
Supabase Studio lokal: http://127.0.0.1:55323 (port lokal 55xxx karena rentang 543xx sering dicadangkan Windows/Hyper-V)

| Perintah | Fungsi |
|---|---|
| `npm run db:reset` | Bangun ulang database lokal dari migrasi + seed |
| `npm run db:test` | Tes database (pgTAP) |
| `npm run db:types` | Generate ulang `lib/supabase/database.types.ts` setelah mengubah skema |
| `npm run typecheck` / `npm run lint` | Cek TypeScript / ESLint |
| `npm run test:api` | Uji end-to-end REST API (lihat docs/API.md) |

## Deploy (gratis): Supabase Free + Vercel Hobby

1. Buat project di https://supabase.com (region Singapore), lalu push skema:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-project>
   npx supabase db push
   ```
2. Buat Turnstile widget di https://dash.cloudflare.com → Turnstile (gratis) → dapat **site key** & **secret key**.
3. Supabase Dashboard:
   - **Authentication → Sign In / Providers**: matikan *Allow new users to sign up*.
   - **Authentication → Attack Protection**: aktifkan *Captcha* → Turnstile → isi **secret key**.
   - **Authentication → Users → Add user** (centang *Auto Confirm*) untuk setiap petugas.
     Nama diatur lewat User Metadata `{"nama": "Siti"}` atau di tabel `profiles`.
     Nonaktifkan petugas: ubah `profiles.status` menjadi `nonaktif`.
   - **Authentication → URL Configuration**: *Site URL* = domain Vercel.
4. Vercel → import repo → Environment Variables:

   | Nama | Nilai |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | site key Cloudflare |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key — **rahasia** |
   | `TURNSTILE_SECRET_KEY` | secret key Cloudflare — **rahasia** |
   | `IP_HASH_SECRET` | 64 karakter acak — **rahasia** |

Catatan paket gratis Supabase: project di-*pause* setelah 7 hari tanpa aktivitas
(bisa diaktifkan kembali dari dashboard, data tetap aman).
