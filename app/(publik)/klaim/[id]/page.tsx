import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormKlaim } from "@/components/publik/form-klaim";
import { RingkasanBarang } from "@/components/publik/ringkasan-barang";
import { InfoSedangDiklaim } from "@/components/publik/info-sedang-diklaim";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { getBarangPublik } from "@/lib/queries/publik";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Ajukan klaim" };

export default async function AjukanKlaimPage({ params }: PageProps<"/klaim/[id]">) {
  const barang = await getBarangPublik((await params).id);
  if (!barang) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      <TautanKembali href={ROUTES.barangPublik(barang.id)}>Kembali ke detail barang</TautanKembali>
      <div>
        <h1 className="text-2xl font-semibold">Ajukan klaim barang</h1>
        <p className="mt-1 text-sm text-muted">
          Isi data berikut dengan jujur. Petugas akan mencocokkan keterangan Anda dengan barang yang tersimpan.
        </p>
      </div>
      <RingkasanBarang barang={barang} />
      {barang.bisa_diklaim ? <FormKlaim itemId={barang.id} /> : <InfoSedangDiklaim />}
    </main>
  );
}
