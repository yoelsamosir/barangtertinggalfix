-- =====================================================================
-- Data contoh untuk PENGEMBANGAN LOKAL saja (dijalankan oleh `supabase db reset`).
-- Tidak ikut ter-push ke project Supabase production.
--
-- Login petugas lokal:  petugas@dpad.test / petugas123
-- =====================================================================

do $$
declare
  v_uid uuid := '11111111-1111-1111-1111-111111111111';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
    'petugas@dpad.test', extensions.crypt('petugas123', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"nama":"Siti Petugas"}', now(), now(),
    '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), v_uid, v_uid::text,
    jsonb_build_object('sub', v_uid::text, 'email', 'petugas@dpad.test', 'email_verified', true),
    'email', now(), now(), now()
  );
end $$;

insert into public.items (nama_barang, kategori, warna, deskripsi, lokasi_ditemukan, tanggal_ditemukan, tampilkan_foto)
values
  ('Dompet kulit', 'dompet', 'Hitam', 'Berisi KTP a.n. B***, 2 kartu ATM, uang tunai. Ada gantungan kunci kecil.', 'Ruang Baca Lt. 2', current_date - 3, true),
  ('Tas ransel', 'tas', 'Biru dongker', 'Merek lokal, isi laptop charger dan buku catatan bersampul batik.', 'Loker lantai 1', current_date - 10, true),
  ('Earphone nirkabel', 'elektronik', 'Putih', 'Case ada goresan di sisi kiri, stiker bintang.', 'Ruang Multimedia', current_date - 1, false),
  ('Kunci motor', 'kunci', 'Perak', 'Gantungan boneka kucing, 2 anak kunci.', 'Parkiran', current_date - 20, true),
  ('Payung lipat', 'lainnya', 'Merah', 'Gagang kayu, ada inisial "R".', 'Lobi', current_date - 5, true);
