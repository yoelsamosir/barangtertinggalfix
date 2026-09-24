-- Jalankan: npx supabase test db
-- Menguji alur klaim -> verifikasi -> pengembalian serta batas akses anon/petugas.
-- Semua perubahan di-rollback di akhir.
begin;
create extension if not exists pgtap with schema extensions;

select plan(39);

-- ---------------------------------------------------------------------
-- Data uji (sebagai postgres)
-- ---------------------------------------------------------------------
insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, encrypted_password)
values ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-0000-0000-000000000001',
        'authenticated', 'authenticated', 'uji@dpad.test', '{"nama":"Petugas Uji"}',
        extensions.crypt('rahasia123', extensions.gen_salt('bf'))),
       ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-0000-0000-000000000002',
        'authenticated', 'authenticated', 'nonaktif@dpad.test', '{}', null);

select is(
  (select nama from public.profiles where id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  'Petugas Uji',
  'Profil petugas dibuat otomatis dari metadata'
);

update public.profiles set status = 'nonaktif' where id = 'aaaaaaaa-0000-0000-0000-000000000002';

insert into public.items (id, nama_barang, kategori, warna, deskripsi, lokasi_ditemukan, tanggal_ditemukan, kode_barang)
values ('bbbbbbbb-0000-0000-0000-000000000001', 'Dompet Uji', 'dompet', 'Hitam',
        'RAHASIA: berisi 3 kartu', 'Ruang Baca', current_date, 'DIABAIKAN');

select matches(
  (select kode_barang from public.items where id = 'bbbbbbbb-0000-0000-0000-000000000001'),
  '^BLG-\d{4}-\d{3,}$',
  'Kode barang dibuat otomatis (input manual diabaikan)'
);

-- =====================================================================
-- PENGUNJUNG (anon)
-- =====================================================================
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

select throws_ok('select * from public.items', '42501', null, 'Anon tidak bisa membaca tabel items');
select throws_ok('select * from public.claims', '42501', null, 'Anon tidak bisa membaca tabel claims');
select throws_ok('select * from public.returns', '42501', null, 'Anon tidak bisa membaca tabel returns');
select throws_ok(
  $$insert into public.claims (item_id, nama_pengklaim, no_hp, waktu_kehilangan, lokasi_kehilangan, ciri_barang)
    values ('bbbbbbbb-0000-0000-0000-000000000001', 'x', '081234567890', current_date, 'x', 'x')$$,
  '42501', null, 'Anon tidak bisa insert klaim langsung ke tabel'
);

select ok(
  exists (select 1 from public.cari_barang_publik('dompet uji') where id = 'bbbbbbbb-0000-0000-0000-000000000001'),
  'Anon bisa mencari barang lewat fungsi publik'
);
select is(
  (select count(*)::int from public.cari_barang_publik('%')),
  0,
  'Karakter wildcard dicari secara literal'
);
select is(
  (select status_publik from public.barang_publik_detail('bbbbbbbb-0000-0000-0000-000000000001')),
  'tersedia',
  'Detail publik menampilkan status aman'
);

select throws_ok(
  $$select public.ajukan_klaim('bbbbbbbb-0000-0000-0000-000000000001', 'Budi Santoso', '081234567890',
                               current_date, 'Ruang Baca', 'Dompet kulit hitam', null)$$,
  '42501', null, 'Anon tidak bisa mengajukan klaim langsung (harus lewat server)'
);
select throws_ok(
  $$select public.pakai_kuota('x', 1, 60)$$,
  '42501', null, 'Anon tidak bisa memakai fungsi rate limit'
);
select throws_ok(
  $$select public.verifikasi_klaim(gen_random_uuid(), true, null)$$,
  '42501', null, 'Anon tidak bisa memanggil fungsi verifikasi'
);

-- =====================================================================
-- SERVER APLIKASI (service_role) — jalur resmi pengajuan klaim
-- =====================================================================
reset role;
set local role service_role;

select matches(
  public.ajukan_klaim('bbbbbbbb-0000-0000-0000-000000000001', 'Budi Santoso', '081234567890',
                      current_date, 'Ruang Baca', 'Dompet kulit hitam', null),
  '^CLM-\d{4}-\d{3,}$',
  'Server bisa mengajukan klaim dan mendapat nomor klaim'
);
select throws_ok(
  $$select public.ajukan_klaim('bbbbbbbb-0000-0000-0000-000000000001', 'Budi Santoso', '081234567890',
                               current_date, 'Ruang Baca', 'Dompet kulit hitam', null)$$,
  'P0001', null, 'Klaim ganda dari nomor HP yang sama ditolak'
);
select lives_ok(
  $$select public.ajukan_klaim('bbbbbbbb-0000-0000-0000-000000000001', 'Ani', '081111111111',
                               current_date, 'Lobi', 'Dompet hitam', null)$$,
  'Pengunjung lain tetap bisa mengklaim barang yang sama'
);
select throws_ok(
  $$select public.ajukan_klaim('bbbbbbbb-0000-0000-0000-000000000001', 'X', '081222222222',
                               current_date + 5, 'Lobi', 'x', null)$$,
  'P0001', null, 'Waktu kehilangan di masa depan ditolak'
);

select ok(public.kuota_tersedia('uji:rate', 2, 60), 'Kuota baru masih tersedia');
select results_eq(
  $$select public.pakai_kuota('uji:rate', 2, 60) from generate_series(1, 3)$$,
  $$values (true), (true), (false)$$,
  'Rate limit menolak setelah kuota habis'
);
select ok(not public.kuota_tersedia('uji:rate', 2, 60), 'Cek kuota melihat kuota sudah habis');
select ok(public.kuota_tersedia('uji:lain', 2, 60), 'Cek kuota tidak memakai kuota');
select ok(public.kuota_tersedia('uji:lain', 2, 60), 'Cek kuota berulang tetap tersedia');

-- =====================================================================
-- PETUGAS NONAKTIF
-- =====================================================================
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-0000-0000-000000000002","role":"authenticated"}';

select is((select count(*)::int from public.items), 0, 'Petugas nonaktif tidak melihat data barang');
select throws_ok($$select public.cek_password_sendiri('x')$$, '42501', null, 'Petugas nonaktif tidak bisa cek password');

-- =====================================================================
-- PETUGAS AKTIF
-- =====================================================================
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}';

select ok(public.cek_password_sendiri('rahasia123'), 'Password lama yang benar dikenali');
select ok(not public.cek_password_sendiri('salah'), 'Password lama yang salah ditolak');
select lives_ok(
  $$select public.cek_password_sendiri('salah') from generate_series(1, 3)$$,
  'Percobaan ke-3 s.d. ke-5 masih diizinkan'
);
select throws_ok(
  $$select public.cek_password_sendiri('rahasia123')$$,
  'PT429', null, 'Percobaan ke-6 dalam 15 menit diblokir'
);

select is(
  (select deskripsi from public.items where id = 'bbbbbbbb-0000-0000-0000-000000000001'),
  'RAHASIA: berisi 3 kartu',
  'Petugas bisa membaca deskripsi internal'
);
select throws_ok(
  $$update public.items set status = 'dikembalikan' where id = 'bbbbbbbb-0000-0000-0000-000000000001'$$,
  'P0001', null, 'Status barang tidak bisa diubah langsung'
);
select throws_ok(
  $$update public.claims set status = 'disetujui'$$,
  '42501', null, 'Petugas tidak bisa update klaim langsung'
);
select throws_ok(
  $$select public.verifikasi_klaim((select id from public.claims where no_hp = '081111111111'), false, '  ')$$,
  'P0001', null, 'Penolakan tanpa alasan ditolak'
);

select lives_ok(
  $$select public.verifikasi_klaim((select id from public.claims where no_hp = '081234567890'), true, 'Ciri cocok')$$,
  'Petugas menyetujui klaim'
);
select is(
  (select status::text from public.items where id = 'bbbbbbbb-0000-0000-0000-000000000001'),
  'diklaim',
  'Barang berubah menjadi diklaim setelah klaim disetujui'
);
select throws_ok(
  $$select public.verifikasi_klaim((select id from public.claims where no_hp = '081111111111'), true, null)$$,
  'P0001', null, 'Klaim kedua tidak bisa disetujui untuk barang yang sama'
);
select throws_ok(
  $$select public.proses_pengembalian((select id from public.claims where no_hp = '081234567890'),
                                      'tidak-ada.jpg', true, null)$$,
  'P0001', null, 'Pengembalian tanpa foto yang terunggah ditolak'
);

-- simulasikan foto yang sudah diunggah: satu di folder klaim lain, satu di folder klaim ini
reset role;
insert into storage.objects (bucket_id, name)
values ('bukti-serah-terima', (select id from public.claims where no_hp = '081111111111') || '/lain.jpg'),
       ('bukti-serah-terima', (select id from public.claims where no_hp = '081234567890') || '/foto.jpg');
set local role authenticated;

select throws_ok(
  $$select public.proses_pengembalian((select id from public.claims where no_hp = '081234567890'),
                                      (select id from public.claims where no_hp = '081111111111') || '/lain.jpg',
                                      true, null)$$,
  'P0001', null, 'Foto dari folder klaim lain ditolak'
);
select lives_ok(
  $$select public.proses_pengembalian((select id from public.claims where no_hp = '081234567890'),
                                      (select id from public.claims where no_hp = '081234567890') || '/foto.jpg',
                                      true, 'Diserahkan langsung')$$,
  'Petugas memproses pengembalian'
);
select results_eq(
  $$select c.status::text, i.status::text
      from public.claims c join public.items i on i.id = c.item_id
     where c.no_hp = '081234567890'$$,
  $$values ('selesai', 'dikembalikan')$$,
  'Klaim selesai dan barang dikembalikan'
);
select is(
  (select status::text from public.claims where no_hp = '081111111111'),
  'ditolak',
  'Klaim lain yang masih menunggu ditolak otomatis'
);

select * from finish();
rollback;
