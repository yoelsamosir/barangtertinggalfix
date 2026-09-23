# REST API — Sistem Informasi Barang Tertinggal

Base URL lokal: `http://localhost:3000`

## Format response

Semua endpoint membalas JSON dengan bentuk yang sama:

```json
{ "ok": true,  "data": { ... }, "message": "opsional" }
{ "ok": false, "jenis": "validasi", "error": "Pesan untuk pengguna", "fieldErrors": { "no_hp": ["..."] } }
```

| `jenis` | HTTP | Arti |
|---|---|---|
| `validasi` | 400 | Isian tidak valid (lihat `fieldErrors`) |
| `captcha` | 400 | Token Turnstile tidak lolos |
| `tidak_login` | 401 | Belum login / sesi habis |
| `akses` | 403 | Tidak berwenang, akun nonaktif, atau request lintas situs (CSRF) |
| `tidak_ditemukan` | 404 | Data tidak ada |
| `konflik` | 409 | Melanggar aturan alur (mis. klaim sudah disetujui) |
| `batas` | 429 | Terlalu banyak percobaan (rate limit) |
| `server` | 500 | Kesalahan server (detail tidak dibocorkan) |

## Autentikasi

- Login lewat `POST /api/auth/login` → server memasang **cookie sesi** (httpOnly tidak tersedia pada `@supabase/ssr`; dilindungi CSP).
- Semua endpoint `/api/petugas/*` wajib cookie sesi petugas **aktif**.
- Request `POST/PATCH/DELETE` dari situs lain ditolak (403). Klien non-browser (Postman/curl) tidak mengirim header `Origin` sehingga tetap bisa dipakai untuk pengujian.
- Body: `application/json`, atau `multipart/form-data` untuk endpoint yang menerima foto (maks 3 MB per request, foto maks 2 MB JPG/PNG/WEBP — isi file diperiksa, bukan hanya ekstensi).

## Rate limit

| Aksi | Batas |
|---|---|
| Ajukan klaim | 5 / jam per IP |
| Login | 20 / 15 menit per IP, **dan** 5 / 15 menit per email |
| Cek password lama (ganti password) | 5 / 15 menit per akun (dijaga database) |
| Klaim menunggu per nomor HP | maks 3 (dijaga database) |

---

## Publik (tanpa login)

### `GET /api/barang`
Daftar barang yang masih tersimpan / dalam proses klaim.
Query: `cari`, `kategori` (`dompet|tas|elektronik|kunci|dokumen|pakaian|aksesoris|lainnya`), `halaman` (20 per halaman).

```json
{ "ok": true, "data": {
  "barang": [{ "id": "…", "nama_barang": "Dompet kulit", "kategori": "dompet", "warna": "Hitam",
               "lokasi_ditemukan": "Ruang Baca Lt. 2", "tanggal_ditemukan": "2026-09-20",
               "status_publik": "tersedia", "bisa_diklaim": true, "foto_url": "https://…" }],
  "total": 1, "halaman": 1, "jumlahHalaman": 1 } }
```
Tidak pernah berisi `deskripsi`, kode internal, atau data pencatat.

### `GET /api/barang/:id`
Detail publik satu barang. 404 bila tidak ada / sudah dikembalikan.

### `POST /api/klaim` → 201
```json
{
  "item_id": "uuid",
  "nama_pengklaim": "Budi Santoso",
  "no_hp": "0812-3456-7890",
  "waktu_kehilangan": "2026-09-20",
  "lokasi_kehilangan": "Ruang Baca",
  "ciri_barang": "Dompet kulit hitam, ada gantungan",
  "keterangan": "opsional",
  "captcha_token": "<token Turnstile>"
}
```
Balasan: `{ "data": { "nomor_klaim": "CLM-2026-001" } }`.
Nomor HP boleh `+62…`/`62…`/`08…` — disimpan sebagai `08…`.

---

## Auth

### `POST /api/auth/login`
`{ "email": "…", "password": "…", "captcha_token": "…" }` → `{ "data": { "id", "nama", "email" } }` + cookie sesi.
Salah email/password selalu dijawab `"Email atau password salah."`.

### `POST /api/auth/logout`
Mencabut sesi dan menghapus cookie.

### `GET /api/auth/sesi`
Petugas yang sedang login, atau 401.

---

## Petugas (wajib login)

### Akun
| Method | Path | Body |
|---|---|---|
| `PATCH` | `/api/petugas/akun/profil` | `{ "nama" }` |
| `POST` | `/api/petugas/akun/password` | `{ "password_lama", "password_baru", "konfirmasi_password" }` — min 8 karakter, huruf + angka |

### Dashboard
`GET /api/petugas/dashboard` → `{ statistik: { barang_tersimpan, barang_diklaim, barang_dikembalikan, klaim_menunggu }, klaimMenunggu: [...5 terbaru] }`

### Barang
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/petugas/barang?cari=&kategori=&status=&halaman=` | `status`: `tersimpan|diklaim|dikembalikan`. `cari` mencocokkan kode, nama, warna, lokasi |
| `POST` | `/api/petugas/barang` | multipart / JSON → 201 `{ id, kode_barang }` |
| `GET` | `/api/petugas/barang/:id` | Lengkap: `deskripsi`, pencatat, riwayat klaim |
| `PATCH` | `/api/petugas/barang/:id` | Field sama dengan POST + `hapus_foto`. Foto baru menggantikan foto lama |
| `DELETE` | `/api/petugas/barang/:id` | Hanya barang `tersimpan` yang belum pernah diklaim (selain itu 409) |

Field barang: `nama_barang`*, `kategori`*, `warna`, `deskripsi` (internal, untuk verifikasi), `lokasi_ditemukan`*, `tanggal_ditemukan`* (`YYYY-MM-DD`, tidak boleh masa depan), `tampilkan_foto` (`true`/`"on"`), `foto` (file).
Kode barang dan status **tidak bisa diisi** — dibuat & dikelola sistem.

### Klaim
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/petugas/klaim?status=&cari=&halaman=` | `status`: `menunggu|disetujui|ditolak|selesai`. `cari`: nomor klaim / nama |
| `GET` | `/api/petugas/klaim/:id` | Klaim + data barang **lengkap** untuk dicocokkan |
| `POST` | `/api/petugas/klaim/:id/verifikasi` | `{ "keputusan": "setujui" \| "tolak", "catatan" }` — catatan wajib bila tolak |
| `POST` | `/api/petugas/klaim/:id/serah-terima` | multipart: `foto`*, `persetujuan_foto`* (`"on"`), `catatan` → 201 `{ return_id }` |

Aturan alur (dijaga database):
- Setujui: hanya dari `menunggu`, dan barang masih `tersimpan` → klaim `disetujui`, barang `diklaim`.
- Tolak: dari `menunggu`, atau membatalkan `disetujui` (barang kembali `tersimpan`).
- Serah terima: hanya klaim `disetujui` → klaim `selesai`, barang `dikembalikan`, klaim lain yang menunggu ditolak otomatis.

### Pengembalian
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/petugas/pengembalian?dari=&sampai=&halaman=` | Tanggal `YYYY-MM-DD` (WIB) |
| `GET` | `/api/petugas/pengembalian/:id` | Termasuk `foto_url` — signed URL, **berlaku 5 menit** |

### Laporan
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/petugas/laporan?dari=&sampai=&kategori=&lokasi=` | Ringkasan barang yang **ditemukan** pada periode itu + status klaimnya |
| `GET` | `/api/petugas/laporan/per-bulan?tahun=&kategori=` | 12 baris `{ bulan, ditemukan, dikembalikan }` untuk grafik |

---

## Server Action (untuk form UI nanti)

Logika yang sama tersedia sebagai Server Action di `lib/actions/*` (siap dipakai `useActionState`).
Nama field sama dengan body API; token Turnstile dari widget (`cf-turnstile-response`) dibaca otomatis.

| Action | File |
|---|---|
| `login`, `logout` | `lib/actions/auth.ts` |
| `ubahProfil`, `gantiPassword` | `lib/actions/akun.ts` |
| `tambahBarang`, `ubahBarang`, `hapusBarang` | `lib/actions/barang.ts` |
| `ajukanKlaim`, `verifikasiKlaim` | `lib/actions/klaim.ts` |
| `serahTerima` | `lib/actions/pengembalian.ts` |

## Menguji

```bash
npm run db:reset
npm run build
npx next start -p 3100
npm run test:api     # di terminal lain — 59 skenario termasuk percobaan bypass keamanan
```
