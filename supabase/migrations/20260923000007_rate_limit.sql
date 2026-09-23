-- =====================================================================
-- Migrasi 7 — RATE LIMIT (fixed window) untuk mencegah spam & brute force.
-- Kunci berisi hash (bukan IP/email mentah), mis. 'klaim:ip:<sha256>'.
-- Hanya bisa dipakai server (service_role) dan fungsi database lain.
-- =====================================================================

create table public.rate_limit (
  kunci    text        not null,
  jendela  timestamptz not null,
  jumlah   int         not null,
  primary key (kunci, jendela)
);

alter table public.rate_limit enable row level security;
revoke all on public.rate_limit from anon, authenticated;

-- Tambah satu pemakaian. true = masih dalam kuota, false = melebihi batas.
create function public.pakai_kuota(p_kunci text, p_maks int, p_jendela_detik int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_jendela timestamptz := to_timestamp(floor(extract(epoch from now()) / p_jendela_detik) * p_jendela_detik);
  v_jumlah  int;
begin
  insert into public.rate_limit as rl (kunci, jendela, jumlah)
  values (p_kunci, v_jendela, 1)
  on conflict (kunci, jendela) do update set jumlah = rl.jumlah + 1
  returning rl.jumlah into v_jumlah;

  -- bersihkan jendela lama sesekali (~1% panggilan) agar tabel tetap kecil
  if random() < 0.01 then
    delete from public.rate_limit where jendela < now() - interval '1 day';
  end if;

  return v_jumlah <= p_maks;
end;
$$;

revoke execute on function public.pakai_kuota(text, int, int) from public, anon, authenticated;
grant  execute on function public.pakai_kuota(text, int, int) to service_role;
