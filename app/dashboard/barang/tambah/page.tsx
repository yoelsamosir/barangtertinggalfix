import type { Metadata } from "next";
import { FormBarang } from "@/components/petugas/barang/form-barang";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Tambah barang" };

export default function TambahBarang() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <TautanKembali href={ROUTES.barang}>Kembali ke data barang</TautanKembali>
      </div>
      <KepalaHalaman judul="Tambah barang">Kode barang dibuat otomatis. Status awal selalu “Tersimpan”.</KepalaHalaman>
      <FormBarang batalHref={ROUTES.barang} />
    </div>
  );
}
