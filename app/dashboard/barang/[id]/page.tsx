import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoBarangPetugas } from "@/components/petugas/barang/info-barang-petugas";
import { RiwayatKlaimBarang } from "@/components/petugas/barang/riwayat-klaim-barang";
import { TombolHapusBarang } from "@/components/petugas/barang/tombol-hapus-barang";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { PesanInfo } from "@/components/ui/pesan-info";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { kelasTombol } from "@/components/ui/tombol";
import { getBarang } from "@/lib/queries/barang";
import { PARAM_INFO, ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Detail barang" };

export default async function DetailBarangPetugas({ params, searchParams }: PageProps<"/dashboard/barang/[id]">) {
  const barang = await getBarang((await params).id);
  if (!barang) notFound();

  // Sama dengan aturan database: hanya barang tersimpan yang belum pernah diklaim.
  const bolehDihapus = barang.status === "tersimpan" && barang.klaim.length === 0;

  return (
    <>
      <div className="mb-4">
        <TautanKembali href={ROUTES.barang}>Kembali ke data barang</TautanKembali>
      </div>
      <KepalaHalaman
        judul={barang.nama_barang}
        aksi={
          <>
            <Link href={ROUTES.barangUbah(barang.id)} className={kelasTombol("kedua")}>
              <Pencil aria-hidden className="size-4" /> Ubah
            </Link>
            {bolehDihapus && <TombolHapusBarang id={barang.id} kode={barang.kode_barang} />}
          </>
        }
      />

      <PesanInfo
        info={(await searchParams)[PARAM_INFO]}
        daftar={{
          baru: `Barang ${barang.kode_barang} berhasil disimpan.`,
          diubah: "Perubahan data barang disimpan.",
        }}
      />

      <div className="space-y-6">
        <InfoBarangPetugas barang={barang} />
        <RiwayatKlaimBarang klaim={barang.klaim} />
      </div>
    </>
  );
}
