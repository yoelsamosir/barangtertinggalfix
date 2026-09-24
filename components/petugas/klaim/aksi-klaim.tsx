import { Check, HandCoins, Undo2, X } from "lucide-react";
import Link from "next/link";
import { kelasTombol } from "@/components/ui/tombol";
import { ROUTES } from "@/lib/routes";
import { DialogKeputusan } from "./dialog-keputusan";
import type { DetailKlaim } from "./perbandingan-klaim";

/**
 * Tombol aksi sesuai status klaim:
 *  menunggu  -> Setujui / Tolak
 *  disetujui -> Proses serah terima / Batalkan persetujuan (barang kembali tersimpan)
 *  ditolak, selesai -> tidak ada aksi (hanya dibaca)
 */
export function AksiKlaim({ klaim }: { klaim: DetailKlaim }) {
  if (klaim.status === "menunggu") {
    return (
      <>
        <DialogKeputusan
          claimId={klaim.id}
          keputusan="tolak"
          varianPemicu="bahaya"
          labelPemicu={
            <>
              <X aria-hidden className="size-4" /> Tolak
            </>
          }
          judul={`Tolak klaim ${klaim.nomor_klaim}?`}
          pesan="Tuliskan alasan penolakan. Catatan hanya terlihat oleh petugas — jangan salin isi deskripsi internal ke pesan untuk pengklaim."
          labelCatatan="Alasan penolakan"
          catatanWajib
          labelKirim="Tolak klaim"
        />
        <DialogKeputusan
          claimId={klaim.id}
          keputusan="setujui"
          varianPemicu="utama"
          labelPemicu={
            <>
              <Check aria-hidden className="size-4" /> Setujui
            </>
          }
          judul={`Setujui klaim ${klaim.nomor_klaim}?`}
          pesan={`Barang “${klaim.barang.nama_barang}” akan berstatus diklaim. Setelah itu hubungi pengklaim untuk datang mengambil barang.`}
          labelCatatan="Catatan (opsional)"
          catatanWajib={false}
          labelKirim="Setujui klaim"
        />
      </>
    );
  }

  if (klaim.status === "disetujui") {
    return (
      <>
        <DialogKeputusan
          claimId={klaim.id}
          keputusan="tolak"
          varianPemicu="bahaya"
          labelPemicu={
            <>
              <Undo2 aria-hidden className="size-4" /> Batalkan persetujuan
            </>
          }
          judul={`Batalkan persetujuan ${klaim.nomor_klaim}?`}
          pesan="Klaim menjadi ditolak dan barang kembali berstatus tersimpan, sehingga bisa diklaim orang lain. Catatan hanya terlihat oleh petugas."
          labelCatatan="Alasan pembatalan"
          catatanWajib
          labelKirim="Batalkan persetujuan"
        />
        <Link href={ROUTES.serahTerima(klaim.id)} className={kelasTombol("utama")}>
          <HandCoins aria-hidden className="size-4" /> Proses serah terima
        </Link>
      </>
    );
  }

  return null;
}
