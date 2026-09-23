-- =====================================================================
-- Migrasi 3 — AKSES: siapa boleh membaca/menulis tabel & file.
--
--   anon (pengunjung) : TIDAK punya akses tabel. Hanya fungsi publik (migrasi 4).
--   authenticated     : hanya berlaku bila is_petugas() = true (profil 'aktif').
--   claims & returns  : hanya dibaca langsung; ditulis lewat fungsi (migrasi 4 & 5).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helper: apakah pemanggil petugas aktif? (dipakai semua policy)
-- ---------------------------------------------------------------------
create function public.is_petugas()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'aktif'
  );
$$;

revoke execute on function public.is_petugas() from public, anon;
grant  execute on function public.is_petugas() to authenticated;

-- ---------------------------------------------------------------------
-- Hak tabel (lapisan 1) — RLS di bawah adalah lapisan 2
-- ---------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.items      enable row level security;
alter table public.claims     enable row level security;
alter table public.returns    enable row level security;
alter table public.nomor_urut enable row level security;

revoke all on public.profiles, public.items, public.claims, public.returns, public.nomor_urut from anon;
revoke all on public.nomor_urut from authenticated;

revoke insert, update, delete on public.profiles from authenticated;
grant  update (nama)          on public.profiles to authenticated;

revoke insert, update, delete on public.claims  from authenticated;
revoke insert, update, delete on public.returns from authenticated;

-- ---------------------------------------------------------------------
-- RLS: profiles
-- ---------------------------------------------------------------------
create policy "Petugas melihat profil petugas"
  on public.profiles for select to authenticated
  using ((select public.is_petugas()));

create policy "Petugas mengubah profil sendiri"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and (select public.is_petugas()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- RLS: items
-- ---------------------------------------------------------------------
create policy "Petugas melihat barang"
  on public.items for select to authenticated
  using ((select public.is_petugas()));

create policy "Petugas menambah barang"
  on public.items for insert to authenticated
  with check ((select public.is_petugas()));

create policy "Petugas mengubah barang"
  on public.items for update to authenticated
  using ((select public.is_petugas()))
  with check ((select public.is_petugas()));

-- Hanya barang yang masih tersimpan; barang dengan klaim tertahan oleh FK.
create policy "Petugas menghapus barang tersimpan"
  on public.items for delete to authenticated
  using ((select public.is_petugas()) and status = 'tersimpan');

-- ---------------------------------------------------------------------
-- RLS: claims & returns (baca saja)
-- ---------------------------------------------------------------------
create policy "Petugas melihat klaim"
  on public.claims for select to authenticated
  using ((select public.is_petugas()));

create policy "Petugas melihat pengembalian"
  on public.returns for select to authenticated
  using ((select public.is_petugas()));

-- ---------------------------------------------------------------------
-- Storage
--   foto-barang         : publik (foto barang di halaman pengunjung)
--   bukti-serah-terima  : PRIVAT, hanya petugas, dibuka lewat signed URL
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('foto-barang',        'foto-barang',        true,  2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('bukti-serah-terima', 'bukti-serah-terima', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Petugas melihat foto barang"
  on storage.objects for select to authenticated
  using (bucket_id = 'foto-barang' and (select public.is_petugas()));

create policy "Petugas mengunggah foto barang"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'foto-barang' and (select public.is_petugas()));

create policy "Petugas mengganti foto barang"
  on storage.objects for update to authenticated
  using (bucket_id = 'foto-barang' and (select public.is_petugas()));

create policy "Petugas menghapus foto barang"
  on storage.objects for delete to authenticated
  using (bucket_id = 'foto-barang' and (select public.is_petugas()));

create policy "Petugas melihat bukti serah terima"
  on storage.objects for select to authenticated
  using (bucket_id = 'bukti-serah-terima' and (select public.is_petugas()));

create policy "Petugas mengunggah bukti serah terima"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'bukti-serah-terima' and (select public.is_petugas()));

-- Bukti yang sudah tercatat di returns tidak bisa dihapus.
-- Hanya file yatim (unggahan yang gagal diproses) yang boleh dibersihkan.
create policy "Petugas menghapus bukti yang belum tercatat"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'bukti-serah-terima'
    and (select public.is_petugas())
    and not exists (select 1 from public.returns r where r.foto_serah_terima = storage.objects.name)
  );
