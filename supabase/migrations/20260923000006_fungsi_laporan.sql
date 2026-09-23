-- =====================================================================
-- Migrasi 6 — FUNGSI LAPORAN & STATISTIK (hanya baca)
-- security invoker: RLS tetap berlaku, non-petugas hanya mendapat angka 0.
-- =====================================================================

create function public.statistik_dashboard()
returns table (
  barang_tersimpan    bigint,
  barang_diklaim      bigint,
  barang_dikembalikan bigint,
  klaim_menunggu      bigint
)
language sql
stable
set search_path = ''
as $$
  select
    (select count(*) from public.items  where status = 'tersimpan'),
    (select count(*) from public.items  where status = 'diklaim'),
    (select count(*) from public.items  where status = 'dikembalikan'),
    (select count(*) from public.claims where status = 'menunggu');
$$;

-- Ringkasan untuk barang yang DITEMUKAN pada periode & filter tertentu,
-- beserta nasib klaim atas barang-barang tersebut.
create function public.laporan_ringkasan(
  p_dari      date default null,
  p_sampai    date default null,
  p_kategori  public.item_kategori default null,
  p_lokasi    text default null
)
returns table (
  barang_ditemukan     bigint,
  barang_tersimpan     bigint,
  barang_diklaim       bigint,
  barang_dikembalikan  bigint,
  klaim_masuk          bigint,
  klaim_menunggu       bigint,
  klaim_disetujui      bigint,
  klaim_ditolak        bigint,
  klaim_selesai        bigint
)
language sql
stable
set search_path = ''
as $$
  with barang as (
    select i.id, i.status
    from public.items i
    where (p_dari is null or i.tanggal_ditemukan >= p_dari)
      and (p_sampai is null or i.tanggal_ditemukan <= p_sampai)
      and (p_kategori is null or i.kategori = p_kategori)
      and (nullif(btrim(p_lokasi), '') is null or i.lokasi_ditemukan ilike '%' || btrim(p_lokasi) || '%')
  ),
  klaim as (
    select c.status from public.claims c join barang b on b.id = c.item_id
  )
  select
    (select count(*) from barang),
    (select count(*) from barang where status = 'tersimpan'),
    (select count(*) from barang where status = 'diklaim'),
    (select count(*) from barang where status = 'dikembalikan'),
    (select count(*) from klaim),
    (select count(*) from klaim where status = 'menunggu'),
    (select count(*) from klaim where status = 'disetujui'),
    (select count(*) from klaim where status = 'ditolak'),
    (select count(*) from klaim where status = 'selesai');
$$;

-- Data grafik: jumlah barang ditemukan & dikembalikan per bulan dalam satu tahun.
create function public.laporan_per_bulan(
  p_tahun     int,
  p_kategori  public.item_kategori default null
)
returns table (
  bulan         int,
  ditemukan     bigint,
  dikembalikan  bigint
)
language sql
stable
set search_path = ''
as $$
  select
    b.bulan,
    (select count(*) from public.items i
      where extract(year from i.tanggal_ditemukan) = p_tahun
        and extract(month from i.tanggal_ditemukan) = b.bulan
        and (p_kategori is null or i.kategori = p_kategori)),
    (select count(*) from public.returns r join public.items i on i.id = r.item_id
      where extract(year from r.tanggal_pengembalian at time zone 'Asia/Jakarta') = p_tahun
        and extract(month from r.tanggal_pengembalian at time zone 'Asia/Jakarta') = b.bulan
        and (p_kategori is null or i.kategori = p_kategori))
  from generate_series(1, 12) as b(bulan)
  order by b.bulan;
$$;

-- ---------------------------------------------------------------------
-- Hak akses
-- ---------------------------------------------------------------------
revoke execute on function
  public.statistik_dashboard(),
  public.laporan_ringkasan(date, date, public.item_kategori, text),
  public.laporan_per_bulan(int, public.item_kategori)
from public, anon;

grant execute on function
  public.statistik_dashboard(),
  public.laporan_ringkasan(date, date, public.item_kategori, text),
  public.laporan_per_bulan(int, public.item_kategori)
to authenticated;
