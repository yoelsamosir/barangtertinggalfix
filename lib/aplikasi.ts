/** Identitas aplikasi & instansi yang tampil di UI. */

export const APLIKASI = {
  nama: "Barang Tertinggal",
  instansi: "Balai Perpustakaan DPAD DIY",
  deskripsi: "Sistem informasi barang tertinggal Balai Perpustakaan Dinas Perpustakaan dan Arsip Daerah DIY.",
} as const;

/**
 * Kontak Balai Layanan Perpustakaan DPAD DIY.
 * Sumber: balaiyanpus.jogjaprov.go.id (footer & halaman Layanan Informasi).
 */
export const INSTANSI = {
  nama: "Balai Layanan Perpustakaan DPAD DIY",
  gedung: "Grhatama Pustaka",
  alamat: "Jl. Janti, Banguntapan, Kabupaten Bantul, DI Yogyakarta 55198",
  peta: "https://maps.app.goo.gl/dFC6zjqEjLrmN7Wp9",
  jamLayanan: "08.00–16.30 WIB",
  email: "balaiyanpus@jogjaprov.go.id",
  // Situs resmi tidak konsisten (4536233 / 4536234); sementara dipakai nomor
  // dari halaman Layanan Informasi. Konfirmasi ke Balai.
  telepon: { tampil: "(0274) 4536233", tel: "+622744536233" },
  whatsapp: { tampil: "0881-2658-192", url: "https://wa.me/628812658192" },
  situs: "https://balaiyanpus.jogjaprov.go.id",
  mediaSosial: [
    { nama: "Instagram", akun: "@balaiyanpus.dpaddiy", url: "https://instagram.com/balaiyanpus.dpaddiy" },
    { nama: "Facebook", akun: "balaiyanpus.dpaddiy", url: "https://www.facebook.com/balaiyanpus.dpaddiy" },
    { nama: "X", akun: "@yanpus_dpaddiy", url: "https://x.com/yanpus_dpaddiy" },
    { nama: "TikTok", akun: "@balai_yanpus", url: "https://www.tiktok.com/@balai_yanpus" },
  ],
} as const;
