import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormSerahTerima } from "@/components/petugas/pengembalian/form-serah-terima";
import { Alert } from "@/components/ui/alert";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { CLAIM_STATUS_LABEL } from "@/lib/domain";
import { getKlaim } from "@/lib/queries/klaim";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Serah terima" };

export default async function SerahTerima({ params }: PageProps<"/dashboard/klaim/[id]/serah-terima">) {
  const klaim = await getKlaim((await params).id);
  if (!klaim) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <TautanKembali href={ROUTES.klaimDetail(klaim.id)}>Kembali ke klaim</TautanKembali>
      </div>
      <KepalaHalaman judul="Serah terima barang">
        <span className="font-mono">{klaim.nomor_klaim}</span> · {klaim.barang.nama_barang} (
        <span className="font-mono">{klaim.barang.kode_barang}</span>) kepada {klaim.nama_pengklaim}
      </KepalaHalaman>

      {klaim.status === "disetujui" ? (
        <FormSerahTerima claimId={klaim.id} namaPengklaim={klaim.nama_pengklaim} />
      ) : (
        <Alert jenis="peringatan" judul="Serah terima tidak dapat diproses">
          Hanya klaim yang sudah disetujui yang bisa diserahterimakan. Status klaim ini:{" "}
          <strong>{CLAIM_STATUS_LABEL[klaim.status]}</strong>.{" "}
          <Link href={ROUTES.klaimDetail(klaim.id)} className="font-semibold underline">
            Buka klaim
          </Link>
        </Alert>
      )}
    </div>
  );
}
