-- =====================================================================
-- Migrasi 2 — OTOMASI: penomoran otomatis & trigger integritas data.
-- Semua fungsi di sini internal (hanya dipanggil trigger), tidak bisa
-- dipanggil lewat API.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Penomoran per tahun: BLG-2026-001, CLM-2026-001
-- ---------------------------------------------------------------------
create function public.buat_nomor(p_prefix text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tahun int := extract(year from now() at time zone 'Asia/Jakarta')::int;
  v_n     int;
begin
  -- upsert atomik: aman walau dua petugas menyimpan bersamaan
  insert into public.nomor_urut as nu (prefix, tahun, terakhir)
  values (p_prefix, v_tahun, 1)
  on conflict (prefix, tahun) do update set terakhir = nu.terakhir + 1
  returning nu.terakhir into v_n;

  return format('%s-%s-%s', p_prefix, v_tahun, lpad(v_n::text, greatest(3, length(v_n::text)), '0'));
end;
$$;

-- ---------------------------------------------------------------------
-- auth.users -> profiles
-- Nama diambil dari User Metadata {"nama": "Siti"}, atau dari email.
-- ---------------------------------------------------------------------
create function public.buat_profil_petugas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'nama'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.buat_profil_petugas();

-- ---------------------------------------------------------------------
-- items
-- Status hanya boleh berubah lewat fungsi alur (migrasi 5), yang
-- menyalakan flag transaksi 'app.alur_status'.
-- ---------------------------------------------------------------------
create function public.items_sebelum_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.kode_barang  := public.buat_nomor('BLG');
  new.status       := 'tersimpan';
  new.dicatat_oleh := coalesce(auth.uid(), new.dicatat_oleh);
  new.created_at   := now();
  new.updated_at   := now();
  return new;
end;
$$;

create trigger items_sebelum_insert
  before insert on public.items
  for each row execute function public.items_sebelum_insert();

create function public.items_sebelum_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.kode_barang is distinct from old.kode_barang
     or new.dicatat_oleh is distinct from old.dicatat_oleh
     or new.created_at is distinct from old.created_at then
    raise exception 'Kode barang, pencatat, dan waktu pencatatan tidak dapat diubah.';
  end if;

  if new.status is distinct from old.status
     and coalesce(current_setting('app.alur_status', true), '') <> 'on' then
    raise exception 'Status barang hanya dapat diubah melalui proses klaim dan pengembalian.';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger items_sebelum_update
  before update on public.items
  for each row execute function public.items_sebelum_update();

-- ---------------------------------------------------------------------
-- claims
-- ---------------------------------------------------------------------
create function public.claims_sebelum_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.nomor_klaim := public.buat_nomor('CLM');
  new.status      := 'menunggu';
  new.created_at  := now();
  new.updated_at  := now();
  return new;
end;
$$;

create trigger claims_sebelum_insert
  before insert on public.claims
  for each row execute function public.claims_sebelum_insert();

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger claims_set_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Hak akses: fungsi internal tidak boleh dipanggil lewat API
-- ---------------------------------------------------------------------
revoke execute on function
  public.buat_nomor(text),
  public.buat_profil_petugas(),
  public.items_sebelum_insert(),
  public.items_sebelum_update(),
  public.claims_sebelum_insert(),
  public.set_updated_at()
from public, anon, authenticated;
