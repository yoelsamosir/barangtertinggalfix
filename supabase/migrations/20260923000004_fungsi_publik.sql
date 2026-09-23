-- =====================================================================
-- Migrasi 4 — FUNGSI PUBLIK (pengunjung tanpa login)
-- Hanya kolom aman yang dikembalikan: tanpa deskripsi & data internal.
-- Barang 'dikembalikan' tidak tampil lagi ke publik.
-- =====================================================================

create function public.cari_barang_publik(
  p_cari     text default null,
  p_kategori public.item_kategori default null,
  p_limit    int default 24,
  p_offset   int default 0
)
returns table (
  id                 uuid,
  nama_barang        text,
  kategori           public.item_kategori,
  warna              text,
  lokasi_ditemukan   text,
  tanggal_ditemukan  date,
  foto_path          text,
  status_publik      text,
  total              bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with q as (
    -- escape wildcard LIKE agar input "%" atau "_" dicari secara literal
    select '%' || replace(replace(replace(btrim(coalesce(p_cari, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as pola,
           btrim(coalesce(p_cari, '')) = '' as tanpa_cari
  )
  select
    i.id,
    i.nama_barang,
    i.kategori,
    i.warna,
    i.lokasi_ditemukan,
    i.tanggal_ditemukan,
    case when i.tampilkan_foto then i.foto_path end,
    case i.status when 'tersimpan' then 'tersedia' else 'dalam_proses_klaim' end,
    count(*) over ()
  from public.items i, q
  where i.status in ('tersimpan', 'diklaim')
    and (p_kategori is null or i.kategori = p_kategori)
    and (
      q.tanpa_cari
      or i.nama_barang ilike q.pola
      or i.warna ilike q.pola
      or i.lokasi_ditemukan ilike q.pola
    )
  order by i.tanggal_ditemukan desc, i.created_at desc
  limit least(greatest(coalesce(p_limit, 24), 1), 100)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

create function public.barang_publik_detail(p_id uuid)
returns table (
  id                 uuid,
  nama_barang        text,
  kategori           public.item_kategori,
  warna              text,
  lokasi_ditemukan   text,
  tanggal_ditemukan  date,
  foto_path          text,
  status_publik      text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    i.id,
    i.nama_barang,
    i.kategori,
    i.warna,
    i.lokasi_ditemukan,
    i.tanggal_ditemukan,
    case when i.tampilkan_foto then i.foto_path end,
    case i.status when 'tersimpan' then 'tersedia' else 'dalam_proses_klaim' end
  from public.items i
  where i.id = p_id
    and i.status in ('tersimpan', 'diklaim');
$$;

-- Pengunjung mengajukan klaim. Mengembalikan nomor klaim (CLM-2026-001).
create function public.ajukan_klaim(
  p_item_id            uuid,
  p_nama_pengklaim     text,
  p_no_hp              text,
  p_waktu_kehilangan   date,
  p_lokasi_kehilangan  text,
  p_ciri_barang        text,
  p_keterangan         text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.item_status;
  v_nomor  text;
begin
  select status into v_status from public.items where id = p_item_id for share;
  if not found then
    raise exception 'Barang tidak ditemukan.' using errcode = 'P0002';
  end if;
  if v_status <> 'tersimpan' then
    raise exception 'Barang ini sedang dalam proses klaim dan belum dapat diklaim.';
  end if;

  if p_waktu_kehilangan > (now() at time zone 'Asia/Jakarta')::date then
    raise exception 'Perkiraan waktu kehilangan tidak boleh di masa depan.';
  end if;

  if exists (
    select 1 from public.claims
    where item_id = p_item_id and no_hp = p_no_hp and status = 'menunggu'
  ) then
    raise exception 'Anda sudah mengajukan klaim untuk barang ini. Silakan tunggu verifikasi petugas.';
  end if;

  -- batas sederhana anti-spam per nomor HP
  if (select count(*) from public.claims where no_hp = p_no_hp and status = 'menunggu') >= 3 then
    raise exception 'Terlalu banyak klaim yang masih menunggu untuk nomor HP ini. Silakan hubungi petugas.';
  end if;

  insert into public.claims (
    item_id, nama_pengklaim, no_hp, waktu_kehilangan,
    lokasi_kehilangan, ciri_barang, keterangan
  )
  values (
    p_item_id, btrim(p_nama_pengklaim), p_no_hp, p_waktu_kehilangan,
    btrim(p_lokasi_kehilangan), btrim(p_ciri_barang), nullif(btrim(p_keterangan), '')
  )
  returning nomor_klaim into v_nomor;

  return v_nomor;
end;
$$;

-- ---------------------------------------------------------------------
-- Hak akses
--   Baca   : boleh langsung dari browser (anon key).
--   Klaim  : HANYA lewat server aplikasi (service_role), setelah lolos
--            Turnstile & rate limit. Anon key bersifat publik, jadi bila
--            anon boleh memanggilnya, pemeriksaan di server bisa dilewati.
-- ---------------------------------------------------------------------
revoke execute on function
  public.cari_barang_publik(text, public.item_kategori, int, int),
  public.barang_publik_detail(uuid)
from public;

grant execute on function
  public.cari_barang_publik(text, public.item_kategori, int, int),
  public.barang_publik_detail(uuid)
to anon, authenticated;

revoke execute on function public.ajukan_klaim(uuid, text, text, date, text, text, text)
from public, anon, authenticated;

grant execute on function public.ajukan_klaim(uuid, text, text, date, text, text, text)
to service_role;
