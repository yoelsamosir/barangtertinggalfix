import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormBarang } from "@/components/petugas/barang/form-barang";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { getBarang } from "@/lib/queries/barang";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Ubah barang" };

export default async function UbahBarang({ params }: PageProps<"/dashboard/barang/[id]/ubah">) {
  const barang = await getBarang((await params).id);
  if (!barang) notFound();

  const detail = ROUTES.barangDetail(barang.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <TautanKembali href={detail}>Kembali ke detail barang</TautanKembali>
      </div>
      <KepalaHalaman judul="Ubah barang">
        <span className="font-mono">{barang.kode_barang}</span> — status tidak dapat diubah di sini; status berubah
        lewat alur klaim dan pengembalian.
      </KepalaHalaman>
      <FormBarang barang={barang} batalHref={detail} />
    </div>
  );
}
