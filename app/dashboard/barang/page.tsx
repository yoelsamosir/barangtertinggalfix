import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FilterBarangPetugas } from "@/components/petugas/barang/filter-barang";
import { TabelBarang } from "@/components/petugas/barang/tabel-barang";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { Paginasi } from "@/components/ui/paginasi";
import { PesanInfo } from "@/components/ui/pesan-info";
import { kelasTombol } from "@/components/ui/tombol";
import { parseHalaman } from "@/lib/pagination";
import { daftarBarang } from "@/lib/queries/barang";
import { denganQuery, PARAM_INFO, ROUTES } from "@/lib/routes";
import { filterBarangSchema } from "@/lib/validation/barang";

export const metadata: Metadata = { title: "Data barang" };

export default async function DataBarang({ searchParams }: PageProps<"/dashboard/barang">) {
  const params = await searchParams;
  const filter = filterBarangSchema.parse(params);
  const { barang, total, halaman, jumlahHalaman } = await daftarBarang(filter, parseHalaman(params.halaman));

  return (
    <>
      <KepalaHalaman
        judul="Data barang"
        aksi={
          <Link href={ROUTES.barangTambah} className={kelasTombol()}>
            <Plus aria-hidden className="size-4" /> Tambah barang
          </Link>
        }
      >
        {total} barang tercatat{filter.cari || filter.kategori || filter.status ? " sesuai filter" : ""}.
      </KepalaHalaman>

      <PesanInfo info={params[PARAM_INFO]} daftar={{ dihapus: "Barang berhasil dihapus." }} />
      <FilterBarangPetugas filter={filter} />

      <div className="space-y-4">
        <TabelBarang barang={barang} adaFilter={Boolean(filter.cari || filter.kategori || filter.status)} />
        <Paginasi
          halaman={halaman}
          jumlahHalaman={jumlahHalaman}
          href={(n) => denganQuery(ROUTES.barang, { ...filter, halaman: n > 1 ? n : undefined })}
        />
      </div>
    </>
  );
}
