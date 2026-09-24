import { INSTANSI } from "@/lib/aplikasi";
import type { ClaimStatus } from "@/lib/domain";

/**
 * Pesan WhatsApp siap kirim dari petugas ke pengklaim, sesuai status klaim.
 * Petugas tetap bisa mengubahnya di WhatsApp sebelum mengirim.
 *
 * Catatan petugas SENGAJA tidak disertakan: catatan bisa memuat detail dari
 * deskripsi internal, yang tidak boleh sampai ke pengklaim (bisa dipakai untuk klaim palsu).
 */

type DataPesan = { nama: string; nomorKlaim: string; namaBarang: string; status: ClaimStatus };

export function pesanWhatsApp({ nama, nomorKlaim, namaBarang, status }: DataPesan): string {
  const pembuka = `Halo ${nama}, kami dari ${INSTANSI.nama} terkait klaim ${nomorKlaim} (${namaBarang}).`;

  switch (status) {
    case "menunggu":
      return `${pembuka} Kami ingin menanyakan beberapa hal untuk memverifikasi klaim Anda.`;
    case "disetujui":
      return (
        `${pembuka} Klaim Anda telah DISETUJUI. Silakan datang ke ${INSTANSI.gedung} ` +
        `pada jam layanan ${INSTANSI.jamLayanan} dengan membawa nomor klaim dan kartu identitas (KTP, KTM, atau identitas lain).`
      );
    case "ditolak":
      return `${pembuka} Mohon maaf, klaim Anda tidak dapat kami setujui karena keterangan yang diberikan belum sesuai dengan barang yang kami simpan.`;
    case "selesai":
      return `${pembuka} Terima kasih, barang telah diserahkan. Semoga bermanfaat.`;
  }
}
