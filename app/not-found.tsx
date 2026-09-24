import Link from "next/link";
import { StatusHalaman } from "@/components/ui/status-halaman";
import { kelasTombol } from "@/components/ui/tombol";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <StatusHalaman
      kode="404"
      judul="Halaman tidak ditemukan"
      aksi={
        <Link href={ROUTES.beranda} className={kelasTombol()}>
          Kembali ke beranda
        </Link>
      }
    >
      Halaman atau data yang Anda cari tidak ada, sudah dihapus, atau sudah tidak ditampilkan.
    </StatusHalaman>
  );
}
