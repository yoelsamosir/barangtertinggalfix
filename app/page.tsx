import { StatusHalaman } from "@/components/ui/status-halaman";
import { APLIKASI } from "@/lib/aplikasi";

// Sementara — diganti halaman publik (cari & daftar barang) pada tahap berikutnya.
export default function Beranda() {
  return (
    <StatusHalaman kode={APLIKASI.instansi} judul={APLIKASI.nama}>
      Halaman publik sedang disiapkan.
    </StatusHalaman>
  );
}
