-- =====================================================================
-- Migrasi 10 — Nomor HP klaim maksimal 13 digit.
-- Nomor HP Indonesia: "08" + 8–11 digit (total 10–13 digit).
-- Sebelumnya 08 + 8–12 digit (sampai 14 digit) terlalu longgar.
-- Harus sama dengan POLA_NO_HP di lib/utils/no-hp.ts.
-- =====================================================================

alter table public.claims drop constraint claims_no_hp_check;
alter table public.claims add constraint claims_no_hp_check check (no_hp ~ '^08[0-9]{8,11}$');
