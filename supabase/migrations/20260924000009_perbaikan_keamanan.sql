-- =====================================================================
-- Migrasi 9 — PERBAIKAN KEAMANAN hasil review.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Cek sisa kuota TANPA memakainya.
-- Dipakai login: kuota per email hanya berkurang untuk password yang
-- salah (setelah captcha lolos), sehingga penyerang tanpa captcha tidak
-- bisa mengunci akun petugas dengan request palsu.
-- ---------------------------------------------------------------------
create function public.kuota_tersedia(p_kunci text, p_maks int, p_jendela_detik int)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select jumlah < p_maks
       from public.rate_limit
      where kunci = p_kunci
        and jendela = to_timestamp(floor(extract(epoch from now()) / p_jendela_detik) * p_jendela_detik)),
    true
  );
$$;

revoke execute on function public.kuota_tersedia(text, int, int) from public, anon, authenticated;
grant  execute on function public.kuota_tersedia(text, int, int) to service_role;

-- ---------------------------------------------------------------------
-- proses_pengembalian: foto bukti harus berada di folder klaim itu
-- sendiri (<claim_id>/...), agar foto klaim lain tidak bisa dipakai.
-- ---------------------------------------------------------------------
create or replace function public.proses_pengembalian(
  p_claim_id          uuid,
  p_foto_path         text,
  p_persetujuan_foto  boolean,
  p_catatan           text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claim     public.claims;
  v_return_id uuid;
begin
  if not public.is_petugas() then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  if not coalesce(p_persetujuan_foto, false) then
    raise exception 'Pengunjung harus menyetujui pengambilan foto serah terima.';
  end if;

  select * into v_claim from public.claims where id = p_claim_id for update;
  if not found then
    raise exception 'Klaim tidak ditemukan.' using errcode = 'P0002';
  end if;
  if v_claim.status <> 'disetujui' then
    raise exception 'Pengembalian hanya dapat diproses untuk klaim yang sudah disetujui.';
  end if;

  if split_part(p_foto_path, '/', 1) <> p_claim_id::text
     or not exists (
       select 1 from storage.objects
       where bucket_id = 'bukti-serah-terima' and name = p_foto_path
     ) then
    raise exception 'Foto bukti serah terima belum diunggah.';
  end if;

  perform 1 from public.items where id = v_claim.item_id for update;
  perform set_config('app.alur_status', 'on', true);

  insert into public.returns (claim_id, item_id, petugas_id, foto_serah_terima, persetujuan_foto, catatan)
  values (p_claim_id, v_claim.item_id, auth.uid(), p_foto_path, true, nullif(btrim(p_catatan), ''))
  returning id into v_return_id;

  update public.claims set status = 'selesai' where id = p_claim_id;
  update public.items set status = 'dikembalikan' where id = v_claim.item_id;

  update public.claims
     set status = 'ditolak',
         catatan_petugas = format('Ditolak otomatis: barang telah dikembalikan melalui klaim %s.', v_claim.nomor_klaim),
         diverifikasi_oleh = auth.uid(),
         diverifikasi_pada = now()
   where item_id = v_claim.item_id
     and status = 'menunggu';

  return v_return_id;
end;
$$;
