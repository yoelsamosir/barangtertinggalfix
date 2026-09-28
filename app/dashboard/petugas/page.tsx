import type { Metadata } from "next";
import { FormTambahPetugas } from "@/components/petugas/kelola/form-tambah-petugas";
import { TabelPetugas } from "@/components/petugas/kelola/tabel-petugas";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { requireAdmin } from "@/lib/auth";
import { daftarPetugas } from "@/lib/queries/petugas";

export const metadata: Metadata = { title: "Kelola Petugas" };

/** KHUSUS ADMIN: tambah petugas, nonaktifkan/aktifkan, atur peran, reset password. */
export default async function KelolaPetugas() {
  const admin = await requireAdmin();
  const petugas = await daftarPetugas();

  return (
    <div>
      <KepalaHalaman judul="Kelola Petugas" aksi={<FormTambahPetugas />}>
        Tambah akun petugas dan atur siapa yang boleh login. Akun yang dinonaktifkan tidak dihapus, sehingga riwayat
        pekerjaannya tetap tersimpan.
      </KepalaHalaman>
      <TabelPetugas petugas={petugas} idSaya={admin.id} />
    </div>
  );
}
