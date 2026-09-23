-- =====================================================================
-- Sistem Informasi Barang Tertinggal — Balai Perpustakaan DPAD DIY
-- Migrasi 1 — SKEMA: tipe, tabel, relasi, indeks.
-- (Tidak berisi logika; logika ada di migrasi berikutnya.)
-- =====================================================================

-- Status barang dan status klaim sengaja dipisah (dua proses berbeda).
create type public.item_status as enum ('tersimpan', 'diklaim', 'dikembalikan');

create type public.claim_status as enum ('menunggu', 'disetujui', 'ditolak', 'selesai');

-- Tambah kategori kelak dengan: alter type public.item_kategori add value 'nama';
create type public.item_kategori as enum (
  'dompet', 'tas', 'elektronik', 'kunci', 'dokumen', 'pakaian', 'aksesoris', 'lainnya'
);

-- ---------------------------------------------------------------------
-- Profil petugas (1:1 dengan auth.users; password dikelola Supabase Auth)
-- ---------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  nama        text not null check (char_length(btrim(nama)) between 1 and 100),
  status      text not null default 'aktif' check (status in ('aktif', 'nonaktif')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Barang temuan
-- ---------------------------------------------------------------------
create table public.items (
  id                 uuid primary key default gen_random_uuid(),
  kode_barang        text not null unique default '',  -- diisi trigger: BLG-2026-001
  nama_barang        text not null check (char_length(btrim(nama_barang)) between 1 and 100),
  kategori           public.item_kategori not null,
  warna              text check (char_length(warna) <= 50),
  -- Detail untuk verifikasi (isi dompet, tanda khusus). TIDAK pernah tampil ke publik.
  deskripsi          text check (char_length(deskripsi) <= 2000),
  lokasi_ditemukan   text not null check (char_length(btrim(lokasi_ditemukan)) between 1 and 150),
  tanggal_ditemukan  date not null,
  foto_path          text,                              -- path di bucket 'foto-barang'
  tampilkan_foto     boolean not null default true,
  status             public.item_status not null default 'tersimpan',
  dicatat_oleh       uuid references public.profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index items_status_idx   on public.items (status);
create index items_kategori_idx on public.items (kategori);
create index items_tanggal_idx  on public.items (tanggal_ditemukan desc);

-- ---------------------------------------------------------------------
-- Pengajuan klaim dari pengunjung
-- ---------------------------------------------------------------------
create table public.claims (
  id                  uuid primary key default gen_random_uuid(),
  nomor_klaim         text not null unique default '',  -- diisi trigger: CLM-2026-001
  -- restrict: barang yang sudah punya klaim tidak bisa dihapus (jejak audit)
  item_id             uuid not null references public.items (id) on delete restrict,
  nama_pengklaim      text not null check (char_length(btrim(nama_pengklaim)) between 1 and 100),
  no_hp               text not null check (no_hp ~ '^08[0-9]{8,12}$'),
  waktu_kehilangan    date not null,
  lokasi_kehilangan   text not null check (char_length(btrim(lokasi_kehilangan)) between 1 and 150),
  ciri_barang         text not null check (char_length(btrim(ciri_barang)) between 1 and 1000),
  keterangan          text check (char_length(keterangan) <= 1000),
  status              public.claim_status not null default 'menunggu',
  catatan_petugas     text check (char_length(catatan_petugas) <= 1000),
  diverifikasi_oleh   uuid references public.profiles (id) on delete set null,
  diverifikasi_pada   timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index claims_item_idx   on public.claims (item_id);
create index claims_status_idx on public.claims (status, created_at desc);

-- Satu barang hanya boleh punya satu klaim yang disetujui/selesai.
create unique index claims_satu_pemenang_per_barang
  on public.claims (item_id)
  where status in ('disetujui', 'selesai');

-- ---------------------------------------------------------------------
-- Pengembalian (serah terima) — satu barang hanya dikembalikan sekali
-- ---------------------------------------------------------------------
create table public.returns (
  id                    uuid primary key default gen_random_uuid(),
  claim_id              uuid not null unique references public.claims (id) on delete restrict,
  item_id               uuid not null unique references public.items (id) on delete restrict,
  petugas_id            uuid references public.profiles (id) on delete set null,
  tanggal_pengembalian  timestamptz not null default now(),
  foto_serah_terima     text not null unique,           -- path di bucket privat 'bukti-serah-terima'
  persetujuan_foto      boolean not null check (persetujuan_foto),
  catatan               text check (char_length(catatan) <= 1000),
  created_at            timestamptz not null default now()
);

create index returns_tanggal_idx on public.returns (tanggal_pengembalian desc);

-- ---------------------------------------------------------------------
-- Penghitung nomor urut per prefix & tahun (dipakai migrasi 2)
-- ---------------------------------------------------------------------
create table public.nomor_urut (
  prefix    text not null,
  tahun     int  not null,
  terakhir  int  not null default 0,
  primary key (prefix, tahun)
);
