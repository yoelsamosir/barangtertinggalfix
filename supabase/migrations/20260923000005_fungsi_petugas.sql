-- =====================================================================
-- Migrasi 5 — FUNGSI PETUGAS: verifikasi klaim & pengembalian barang.
-- Satu-satunya jalan untuk mengubah status klaim/barang.
-- =====================================================================

-- Setujui / tolak klaim.
--   Setujui : klaim 'menunggu' -> 'disetujui', barang -> 'diklaim'.
--             Klaim lain yang masih menunggu dibiarkan (baru ditolak otomatis
--             saat pengembalian selesai), jadi aman bila persetujuan dibatalkan.
--   Tolak   : dari 'menunggu', atau membatalkan 'disetujui' (pemilik tidak datang).
--             Bila membatalkan, barang kembali 'tersimpan'. Alasan wajib diisi.
create function public.verifikasi_klaim(
  p_claim_id  uuid,
  p_setujui   boolean,
  p_catatan   text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claim       public.claims;
  v_item_status public.item_status;
  v_catatan     text := nullif(btrim(p_catatan), '');
begin
  if not public.is_petugas() then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;

  select * into v_claim from public.claims where id = p_claim_id for update;
  if not found then
    raise exception 'Klaim tidak ditemukan.' using errcode = 'P0002';
  end if;

  select status into v_item_status from public.items where id = v_claim.item_id for update;

  perform set_config('app.alur_status', 'on', true);

  if p_setujui then
    if v_claim.status <> 'menunggu' then
      raise exception 'Hanya klaim berstatus menunggu yang dapat disetujui.';
    end if;
    if v_item_status <> 'tersimpan' then
      raise exception 'Barang ini sudah memiliki klaim yang disetujui atau sudah dikembalikan.';
    end if;

    update public.claims
       set status = 'disetujui',
           catatan_petugas = v_catatan,
           diverifikasi_oleh = auth.uid(),
           diverifikasi_pada = now()
     where id = p_claim_id;

    update public.items set status = 'diklaim' where id = v_claim.item_id;
  else
    if v_catatan is null then
      raise exception 'Alasan penolakan wajib diisi.';
    end if;
    if v_claim.status not in ('menunggu', 'disetujui') then
      raise exception 'Klaim ini sudah ditolak atau sudah selesai.';
    end if;

    update public.claims
       set status = 'ditolak',
           catatan_petugas = v_catatan,
           diverifikasi_oleh = auth.uid(),
           diverifikasi_pada = now()
     where id = p_claim_id;

    if v_claim.status = 'disetujui' then
      update public.items set status = 'tersimpan' where id = v_claim.item_id;
    end if;
  end if;
end;
$$;

-- Serah terima barang. Foto harus sudah diunggah ke bucket 'bukti-serah-terima'.
-- Satu transaksi:
--   returns (baru), claims -> 'selesai', items -> 'dikembalikan',
--   klaim lain untuk barang yang sama yang masih menunggu -> 'ditolak'.
create function public.proses_pengembalian(
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

  if not exists (
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

-- ---------------------------------------------------------------------
-- Hak akses
-- ---------------------------------------------------------------------
revoke execute on function
  public.verifikasi_klaim(uuid, boolean, text),
  public.proses_pengembalian(uuid, text, boolean, text)
from public, anon;

grant execute on function
  public.verifikasi_klaim(uuid, boolean, text),
  public.proses_pengembalian(uuid, text, boolean, text)
to authenticated;
