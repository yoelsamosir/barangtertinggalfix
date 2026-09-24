import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPengembalian } from "@/components/petugas/pengembalian/info-pengembalian";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { PesanInfo } from "@/components/ui/pesan-info";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { getPengembalian } from "@/lib/queries/pengembalian";
import { PARAM_INFO, ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Detail pengembalian" };

export default async function DetailPengembalian({ params, searchParams }: PageProps<"/dashboard/pengembalian/[id]">) {
  const data = await getPengembalian((await params).id);
  if (!data) notFound();

  return (
    <>
      <div className="mb-4">
        <TautanKembali href={ROUTES.pengembalian}>Kembali ke riwayat pengembalian</TautanKembali>
      </div>
      <KepalaHalaman judul="Bukti pengembalian">
        {data.barang?.nama_barang} diserahkan kepada {data.klaim?.nama_pengklaim}.
      </KepalaHalaman>
      <PesanInfo
        info={(await searchParams)[PARAM_INFO]}
        daftar={{
          baru: "Serah terima selesai. Klaim ditutup, barang tidak lagi tampil di halaman publik, dan klaim lain yang menunggu ditolak otomatis.",
        }}
      />
      <InfoPengembalian data={data} />
    </>
  );
}
