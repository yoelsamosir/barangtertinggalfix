# Panduan Deploy — Supabase + Vercel

Panduan memasang aplikasi Barang Tertinggal Balai Perpustakaan DPAD DIY ke internet dengan layanan
gratis: **Supabase Free** (database, login, penyimpanan foto) dan **Vercel Hobby** (menjalankan aplikasi),
plus **Cloudflare Turnstile** (captcha). Ikuti urutannya dari atas ke bawah.

> Perkiraan waktu: 45–60 menit untuk pertama kali.

## Daftar isi

1. [Yang perlu disiapkan](#1-yang-perlu-disiapkan)
2. [Supabase: database & login](#2-supabase-database--login)
3. [Cloudflare Turnstile: captcha](#3-cloudflare-turnstile-captcha)
4. [Vercel: menjalankan aplikasi](#4-vercel-menjalankan-aplikasi)
5. [Sambungkan domain ke Supabase](#5-sambungkan-domain-ke-supabase)
6. [Buat akun petugas](#6-buat-akun-petugas)
7. [Periksa setelah deploy](#7-periksa-setelah-deploy)
8. [Memperbarui aplikasi di kemudian hari](#8-memperbarui-aplikasi-di-kemudian-hari)
9. [Mengelola akun petugas](#9-mengelola-akun-petugas)
10. [Cadangan data](#10-cadangan-data)
11. [Batas paket gratis](#11-batas-paket-gratis)
12. [Pemecahan masalah](#12-pemecahan-masalah)

---

## 1. Yang perlu disiapkan

**Akun (semua gratis):**
- GitHub, dengan akses ke repository ini
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com), paling mudah daftar dengan akun GitHub
- [Cloudflare](https://dash.cloudflare.com), untuk Turnstile

**Di komputer:**
- **Node.js 22.18 atau lebih baru** (disarankan 24 LTS). Cek dengan `node -v`.
- Salinan repository ini, lalu jalankan sekali:
  ```bash
  npm install
  ```
  Perintah ini juga memasang Supabase CLI (`npx supabase ...`). **Docker tidak diperlukan** untuk deploy.

**Tentukan nama proyek Vercel dari awal**, misalnya `barang-tertinggal-dpad`. Alamat aplikasi nanti
menjadi `https://barang-tertinggal-dpad.vercel.app`. Alamat ini dipakai di langkah 3, 4, dan 5.
Di panduan ini disebut **ALAMAT-APLIKASI**.

---

## 2. Supabase: database & login

### 2.1 Buat project

1. Masuk ke [supabase.com/dashboard](https://supabase.com/dashboard), lalu klik **New project**.
2. Isi:
   - **Name**: mis. `barang-tertinggal`
   - **Database Password**: buat password yang kuat lalu **simpan baik-baik**, karena dibutuhkan di langkah 2.2
   - **Region**: **Southeast Asia (Singapore)**, yang paling dekat dengan Indonesia
3. Tunggu beberapa menit sampai project siap.
4. Catat **Project Ref**, yaitu bagian acak di alamat dashboard:
   `https://supabase.com/dashboard/project/`**`abcdefghijklmnopqrst`**

### 2.2 Kirim struktur database (migrasi)

Dari folder repository:

```bash
npx supabase login
```

```bash
npx supabase link --project-ref <PROJECT-REF>
```

(masukkan Database Password dari langkah 2.1)

```bash
npx supabase db push
```

`db push` menjalankan semua file di `supabase/migrations/`: membuat tabel, aturan keamanan (RLS),
fungsi alur klaim, dan **dua bucket penyimpanan foto** (`foto-barang` publik, `bukti-serah-terima` privat).

> ⚠️ **Jangan** memakai `--include-seed`. File `supabase/seed.sql` berisi akun uji
> `petugas@dpad.test` / `petugas123` dan data contoh yang **hanya untuk komputer lokal**.

Cek hasilnya: Dashboard → **Table Editor** menampilkan tabel `profiles`, `items`, `claims`, `returns`,
`nomor_urut`, `rate_limit`, dan **Storage** menampilkan kedua bucket.

### 2.3 Ambil kunci API

Dashboard → **Project Settings → API Keys** (di dashboard lama: **API**). Catat:

| Yang dicatat | Dipakai sebagai |
|---|---|
| **Project URL** (`https://<ref>.supabase.co`, ada di *Project Settings → Data API*) | `NEXT_PUBLIC_SUPABASE_URL` |
| **Publishable key** (`sb_publishable_...`) atau **anon key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Secret key** (`sb_secret_...`) atau **service_role key** | `SUPABASE_SERVICE_ROLE_KEY`: 🔒 **RAHASIA** |

> 🔒 Secret / service_role key melewati semua aturan keamanan database. Jangan pernah menaruhnya di
> kode, di chat, atau di variabel yang berawalan `NEXT_PUBLIC_`.

### 2.4 Pengaturan login (Authentication)

Nama menu bisa sedikit berbeda antarversi dashboard; cari menu yang paling mirip.

1. **Authentication → Sign In / Providers**:
   - Matikan **Allow new users to sign up**. Akun petugas hanya dibuat oleh pengelola (langkah 6).
   - Provider **Email** tetap aktif.
2. **Authentication → Sessions** (atau **Project Settings → JWT Keys**):
   - **Access token (JWT) expiry** = **`600`** detik (10 menit).
   - Tanpa ini, setelah petugas mengganti password, perangkat lain yang login dengan akun itu tetap bisa
     masuk sampai 1 jam. Nilai ini harus sama dengan `MASA_TOKEN_MENIT` di `lib/config.ts`.
3. **Authentication → Attack Protection**: dikerjakan di langkah 3.3 setelah kunci Turnstile ada.
4. **Authentication → URL Configuration**: dikerjakan di langkah 5 setelah alamat aplikasi pasti.

---

## 3. Cloudflare Turnstile: captcha

Turnstile melindungi form **login** dan **pengajuan klaim** dari bot.

### 3.1 Buat widget

1. [dash.cloudflare.com](https://dash.cloudflare.com), lalu **Turnstile**, lalu **Add widget**.
2. Isi:
   - **Widget name**: `Barang Tertinggal`
   - **Hostnames**: `barang-tertinggal-dpad.vercel.app` (ALAMAT-APLIKASI **tanpa** `https://`).
     Bila nanti memakai domain sendiri, tambahkan domain itu juga.
   - **Widget mode**: **Managed**
3. Catat **Site Key** dan **Secret Key**.

> Jangan memakai kunci uji `1x000...AA` dari `.env.example` di production, karena kunci uji
> meloloskan siapa saja.

### 3.2 Kunci untuk Vercel

| Dari Cloudflare | Dipakai sebagai |
|---|---|
| Site Key | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| Secret Key | `TURNSTILE_SECRET_KEY`: 🔒 **RAHASIA** |

### 3.3 Aktifkan captcha di Supabase

Login petugas diperiksa langsung oleh Supabase, jadi Supabase juga perlu Secret Key yang sama:

Supabase → **Authentication → Attack Protection** → aktifkan **Enable Captcha protection** →
provider **Cloudflare Turnstile** → isi **Secret Key** → **Save**.

---

## 4. Vercel: menjalankan aplikasi

### 4.1 Buat rahasia IP_HASH_SECRET

Nilai acak untuk menyamarkan IP & email di pembatas percobaan (rate limit). Jalankan sekali:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Salin hasilnya (64 karakter). 🔒 **RAHASIA.**

### 4.2 Import repository

1. [vercel.com/new](https://vercel.com/new), lalu **Import** repository ini dari GitHub.
2. **Project Name**: nama yang ditentukan di langkah 1 (mis. `barang-tertinggal-dpad`).
3. **Framework Preset**: *Next.js* (terdeteksi otomatis). Build Command & Output biarkan bawaan.
4. Buka **Environment Variables** dan isi ketujuh variabel berikut:

| Nama | Nilai | Rahasia? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase (2.3) | tidak |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key (2.3) | tidak |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site Key Turnstile (3.1) | tidak |
| `APP_URL` | `https://barang-tertinggal-dpad.vercel.app` (ALAMAT-APLIKASI, **tanpa** `/` di akhir) | tidak |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret / service_role key (2.3) | 🔒 ya |
| `TURNSTILE_SECRET_KEY` | Secret Key Turnstile (3.1) | 🔒 ya |
| `IP_HASH_SECRET` | hasil perintah 4.1 | 🔒 ya |

5. Klik **Deploy** dan tunggu hingga selesai (±2–3 menit).

### 4.3 Pastikan alamat aplikasi

Buka **Project → Settings → Domains**. Bila alamatnya **berbeda** dari yang diisi di `APP_URL` (misalnya
Vercel menambah akhiran karena nama sudah dipakai orang lain):

1. Ubah `APP_URL` di **Settings → Environment Variables** ke alamat yang benar.
2. Perbarui **Hostnames** widget Turnstile (3.1).
3. **Deployments** → deploy terakhir → **⋯ → Redeploy**. Perubahan variabel baru berlaku setelah redeploy.

### 4.4 Pilih region server (disarankan)

**Settings → Functions → Function Region** → **Singapore (sin1)**, supaya server aplikasi dekat dengan
database Supabase di Singapura. Tanpa ini, server bawaan berada di Amerika dan setiap halaman terasa
lebih lambat. Setelah diubah, lakukan **Redeploy**.

> Versi Node.js dipilih otomatis dari `package.json` (`"engines": { "node": ">=22.18" }`).

---

## 5. Sambungkan domain ke Supabase

Supabase → **Authentication → URL Configuration**:
- **Site URL**: ALAMAT-APLIKASI, mis. `https://barang-tertinggal-dpad.vercel.app`

---

## 6. Buat akun petugas

Pendaftaran publik ditutup; akun dibuat oleh pengelola.

1. Supabase → **Authentication → Users → Add user → Create new user**.
2. Isi **email** dan **password** (min. 8 karakter, ada huruf dan angka), lalu centang **Auto Confirm User**.
3. Profil petugas dibuat **otomatis** dan langsung **aktif**. Nama awalnya diambil dari bagian email sebelum
   `@`. Nama bisa diganti oleh petugas sendiri di menu **Profil**, atau oleh pengelola di
   **Table Editor → profiles → kolom `nama`**.

Ulangi untuk setiap petugas. Semua petugas setara (tidak ada peran admin di aplikasi).

---

## 7. Periksa setelah deploy

Buka ALAMAT-APLIKASI dan cek satu per satu:

- [ ] Beranda tampil dengan logo dan footer kontak Balai.
- [ ] **Masuk petugas**: widget Turnstile muncul, login berhasil dan masuk ke Dashboard.
- [ ] **Tambah barang** dengan foto, lalu barang tampil di beranda.
- [ ] Buka barang di beranda, lalu **Saya pemilik barang ini**, lalu ajukan klaim. **Nomor klaim** harus muncul.
- [ ] Di Dashboard, klaim itu muncul (angka di menu **Klaim**). Setujui klaimnya.
- [ ] **Proses serah terima dari HP**: centang persetujuan, lalu **kamera menyala**. Ambil foto dan selesaikan.
      Kamera browser hanya jalan di HTTPS, jadi ini pertama kalinya kamera HP sungguhan bisa diuji.
- [ ] **Pengembalian**: foto bukti tampil. **Laporan**: angka & grafik muncul, **Unduh CSV** berhasil.
- [ ] Setelah semua beres, **hapus data uji** tadi (barang uji di menu Data Barang).

Pemeriksaan keamanan singkat (opsional), dari terminal:

```bash
curl -sI https://barang-tertinggal-dpad.vercel.app | grep -iE "content-security-policy|strict-transport|x-frame"
```

Ketiga header itu harus muncul.

---

## 8. Memperbarui aplikasi di kemudian hari

**Perubahan kode saja:** push ke branch `main`. Vercel otomatis membangun & menerbitkan versi baru.
GitHub Actions (`.github/workflows/ci.yml`) juga otomatis menjalankan pemeriksaan kode, 40 tes
database, dan 62 uji API. Lihat hasilnya di tab **Actions** GitHub.

**Ada migrasi database baru** (file baru di `supabase/migrations/`): kirim database **dulu**, baru kode:

```bash
npx supabase db push --dry-run
```

(lihat dulu migrasi apa yang akan dijalankan)

```bash
npx supabase db push
```

Setelah itu push kode ke `main`.

> Jangan mengubah file migrasi yang sudah pernah di-push. Perubahan skema selalu lewat **file migrasi baru**.

**Preview deploy:** Vercel juga membuat alamat *preview* untuk setiap pull request. Preview memakai
variabel yang sama, artinya **database production yang sama**. Hati-hati menguji di preview. Bila tidak
diinginkan, batasi variabel hanya untuk environment *Production* di Settings → Environment Variables.

---

## 9. Mengelola akun petugas

| Kebutuhan | Caranya |
|---|---|
| Tambah petugas | Langkah 6 |
| Ganti nama | Petugas sendiri: menu **Profil**. Pengelola: Table Editor → `profiles` → `nama` |
| **Nonaktifkan** petugas (mis. pindah tugas) | Table Editor → `profiles` → `status` = `nonaktif`. Login ditolak dan sesi lama langsung tidak bisa membaca data. Riwayat pekerjaannya tetap tersimpan |
| Aktifkan kembali | `status` = `aktif` |
| Petugas ganti password sendiri | Menu **Profil → Ganti password** (wajib password lama) |
| **Lupa password** | Pengelola membuat password sementara lewat **SQL Editor** (lihat di bawah), lalu petugas menggantinya di menu Profil |

Reset password lewat Supabase → **SQL Editor** (ganti email & password sementara):

```sql
update auth.users
set encrypted_password = extensions.crypt('PasswordSementara123', extensions.gen_salt('bf'))
where email = 'nama.petugas@contoh.go.id';
```

> Tombol *Send password recovery* di dashboard butuh pengiriman email (SMTP) yang belum diatur, dan
> aplikasi ini memang tidak punya halaman reset password. Karena itu dipakai cara SQL di atas.

Jangan menghapus pengguna di Authentication → Users bila petugas itu pernah memproses data; cukup
**nonaktifkan**, agar riwayat "dicatat oleh" / "diputuskan oleh" tetap utuh.

---

## 10. Cadangan data

Paket gratis Supabase tidak menyediakan unduhan cadangan otomatis. Buat cadangan berkala (mis. sebulan
sekali) dari folder repository:

```bash
npx supabase db dump --linked -f cadangan-skema.sql
```

```bash
npx supabase db dump --linked --data-only -f cadangan-data.sql
```

Simpan kedua file itu di tempat aman (bukan di repository, karena berisi data pribadi pengklaim).

> Foto (Storage) tidak ikut dalam dump di atas. Foto dapat diunduh dari Dashboard → Storage bila perlu.

---

## 11. Batas paket gratis

| Layanan | Batas yang relevan |
|---|---|
| Supabase Free | Database 500 MB, Storage 1 GB. Foto dikecilkan otomatis (±100–400 KB/foto), cukup untuk ribuan barang. **Project di-*pause* setelah 7 hari tanpa aktivitas.** Aktifkan lagi dari dashboard (**Restore project**); data tetap aman |
| Vercel Hobby | Ditujukan untuk penggunaan **non-komersial**. Bila instansi membutuhkan jaminan layanan, pertimbangkan paket berbayar |
| Cloudflare Turnstile | Gratis tanpa batas yang relevan |

---

## 12. Pemecahan masalah

| Gejala | Kemungkinan penyebab & solusi |
|---|---|
| Build Vercel gagal: *NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi* | Variabel belum diisi atau salah nama (4.2). Isi lalu **Redeploy** |
| Login atau ajukan klaim berakhir di halaman *Halaman gagal dimuat*; di Vercel → Deployments → **Logs** tertulis *Konfigurasi server tidak lengkap* | `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, atau `IP_HASH_SECRET` kosong (IP_HASH_SECRET minimal 32 karakter). Isi lalu Redeploy |
| Login: *Verifikasi keamanan gagal* | Secret Key Turnstile di Supabase (3.3) tidak sama dengan widget, atau hostname widget belum memuat ALAMAT-APLIKASI (3.1) |
| Widget Turnstile tidak muncul / error | Hostname widget tidak cocok dengan alamat yang dibuka, atau Site Key salah |
| Login: *Email atau password salah* padahal yakin benar | Salah ketik email/password, atau akun belum dibuat di project Supabase yang sama dengan `NEXT_PUBLIC_SUPABASE_URL`. Reset password lewat SQL (9) |
| Login: *Login sedang tidak dapat diproses* | Akun dibuat tanpa **Auto Confirm User**. Hapus lalu buat ulang dengan centang itu |
| Login: *Akun petugas tidak aktif* | `profiles.status` = `nonaktif`. Ubah ke `aktif` bila memang masih bertugas |
| Klaim: *Verifikasi keamanan gagal* | `TURNSTILE_SECRET_KEY` di Vercel salah / masih kunci uji |
| Permintaan ke `/api/...` dari browser ditolak **403** | `APP_URL` kosong atau berbeda dengan alamat yang dibuka (perhatikan `https://`, tanpa `/` di akhir). Perbaiki lalu Redeploy |
| Foto barang tidak tampil | `NEXT_PUBLIC_SUPABASE_URL` salah (foto diizinkan CSP hanya dari alamat Supabase itu), atau opsi *Tampilkan foto ke publik* tidak dicentang (untuk halaman publik) |
| Foto bukti di detail pengembalian tidak tampil | Tautan foto berlaku 5 menit. Muat ulang halaman |
| Kamera tidak menyala di HP | Harus lewat HTTPS (alamat Vercel sudah HTTPS) dan izin kamera di browser diizinkan. Bila tetap tidak bisa, tombol cadangan membuka aplikasi kamera HP |
| Semua halaman lambat | Region fungsi Vercel belum Singapore (4.4) |
| Situs tidak bisa dibuka setelah lama tidak dipakai | Project Supabase di-*pause* (11). Restore dari dashboard |

Detail teknis lain: arsitektur di [README](../README.md), daftar endpoint di [API.md](API.md).
