import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AksiKlaim } from "@/components/petugas/klaim/aksi-klaim";
import { BadgeStatusKlaim } from "@/components/petugas/klaim/badge-status-klaim";
import { DataPengklaim } from "@/components/petugas/klaim/data-pengklaim";
import { DaftarKlaimLain } from "@/components/petugas/klaim/klaim-lain";
import { PanelBarangKlaim } from "@/components/petugas/klaim/panel-barang-klaim";
import { PerbandinganKlaim } from "@/components/petugas/klaim/perbandingan-klaim";
import { RiwayatKeputusan } from "@/components/petugas/klaim/riwayat-keputusan";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { PesanInfo } from "@/components/ui/pesan-info";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { getKlaim, klaimLainAtasBarang } from "@/lib/queries/klaim";
import { PARAM_INFO, ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Verifikasi klaim" };

export default async function DetailKlaim({ params, searchParams }: PageProps<"/dashboard/klaim/[id]">) {
  const klaim = await getKlaim((await params).id);
  if (!klaim) notFound();
  const klaimLain = await klaimLainAtasBarang(klaim.item_id, klaim.id);

  return (
    <>
      <div className="mb-4">
        <TautanKembali href={ROUTES.klaim}>Kembali ke daftar klaim</TautanKembali>
      </div>
      <KepalaHalaman judul={`Klaim ${klaim.nomor_klaim}`} aksi={<AksiKlaim klaim={klaim} />}>
        <BadgeStatusKlaim status={klaim.status} />
      </KepalaHalaman>

      <PesanInfo
        info={(await searchParams)[PARAM_INFO]}
        daftar={{
          disetujui: "Klaim disetujui. Hubungi pengklaim untuk datang mengambil barang.",
          ditolak: "Keputusan disimpan: klaim ditolak.",
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <PerbandinganKlaim klaim={klaim} />
          <DataPengklaim klaim={klaim} />
        </div>
        <aside className="space-y-6">
          <PanelBarangKlaim barang={klaim.barang} />
          <RiwayatKeputusan klaim={klaim} />
          <DaftarKlaimLain klaim={klaimLain} />
        </aside>
      </div>
    </>
  );
}
