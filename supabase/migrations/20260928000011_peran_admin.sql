-- =====================================================================
-- Migrasi 11 — PERAN ADMIN: pengelolaan akun petugas dari aplikasi.
--
--   petugas : semua fitur barang/klaim/pengembalian/laporan (seperti sebelumnya).
--   admin   : petugas + menambah petugas, menonaktifkan/mengaktifkan,
--             mengatur peran, dan mereset password petugas lain.
--
-- Pembuatan akun & reset password memakai Supabase Auth Admin API di server
-- (service_role) setelah aplikasi memastikan pemanggil admin. Perubahan
-- status & peran hanya lewat fungsi di bawah, yang memeriksa is_admin()
-- sendiri, sehingga tetap aman walau dipanggil langsung ke Supabase.
-- =====================================================================

alter table public.profiles
  add column peran text not null default 'petugas' check (peran in ('petugas', 'admin'));

-- Akun paling awal menjadi admin pertama (sebelumnya akun dikelola lewat dashboard Supabase).
update public.profiles
set peran = 'admin'
where id = (select id from public.profiles where status = 'aktif' order by created_at limit 1);

-- Catatan: authenticated hanya punya hak UPDATE (nama) — lihat migrasi 3 —
-- jadi petugas tidak bisa menaikkan perannya sendiri.

-- ---------------------------------------------------------------------
-- Helper: apakah pemanggil admin aktif?
-- ---------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'aktif' and peran = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- Daftar petugas beserta email & login terakhir (dari auth.users).
-- ---------------------------------------------------------------------
create function public.daftar_petugas()
returns table (
  id               uuid,
  nama             text,
  email            text,
  peran            text,
  status           text,
  created_at       timestamptz,
  terakhir_login   timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengelola petugas.' using errcode = '42501';
  end if;

  return query
    select p.id, p.nama, u.email::text, p.peran, p.status, p.created_at, u.last_sign_in_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by (p.status = 'aktif') desc, p.nama;
end;
$$;

revoke execute on function public.daftar_petugas() from public, anon;
grant  execute on function public.daftar_petugas() to authenticated;

-- ---------------------------------------------------------------------
-- Ubah status (aktif / nonaktif). Admin tidak dapat menonaktifkan dirinya
-- sendiri, sehingga selalu tersisa minimal satu admin aktif.
-- ---------------------------------------------------------------------
create function public.ubah_status_petugas(p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengelola petugas.' using errcode = '42501';
  end if;
  if p_status not in ('aktif', 'nonaktif') then
    raise exception 'Status tidak valid.' using errcode = 'P0001';
  end if;
  if p_id = auth.uid() then
    raise exception 'Anda tidak dapat mengubah status akun Anda sendiri.' using errcode = 'P0001';
  end if;

  update public.profiles set status = p_status where id = p_id;
  if not found then
    raise exception 'Petugas tidak ditemukan.' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.ubah_status_petugas(uuid, text) from public, anon;
grant  execute on function public.ubah_status_petugas(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- Atur peran (petugas / admin). Admin tidak dapat menurunkan dirinya sendiri.
-- ---------------------------------------------------------------------
create function public.atur_peran_petugas(p_id uuid, p_peran text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengelola petugas.' using errcode = '42501';
  end if;
  if p_peran not in ('petugas', 'admin') then
    raise exception 'Peran tidak valid.' using errcode = 'P0001';
  end if;
  if p_id = auth.uid() then
    raise exception 'Anda tidak dapat mengubah peran akun Anda sendiri.' using errcode = 'P0001';
  end if;

  update public.profiles set peran = p_peran where id = p_id;
  if not found then
    raise exception 'Petugas tidak ditemukan.' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.atur_peran_petugas(uuid, text) from public, anon;
grant  execute on function public.atur_peran_petugas(uuid, text) to authenticated;
