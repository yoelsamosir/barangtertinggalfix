-- =====================================================================
-- Migrasi 8 — AKUN PETUGAS: cek password lama sebelum ganti password.
-- Dibatasi 5 percobaan / 15 menit per akun, juga bila dipanggil langsung
-- ke Supabase dengan sesi curian.
-- =====================================================================

create function public.cek_password_sendiri(p_password text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid  uuid := auth.uid();
  v_hash text;
begin
  if v_uid is null or not public.is_petugas() then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  if not public.pakai_kuota('password:' || v_uid, 5, 900) then
    raise exception 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' using errcode = 'PT429';
  end if;

  select encrypted_password into v_hash from auth.users where id = v_uid;
  return v_hash is not null and v_hash = extensions.crypt(p_password, v_hash);
end;
$$;

revoke execute on function public.cek_password_sendiri(text) from public, anon;
grant  execute on function public.cek_password_sendiri(text) to authenticated;
