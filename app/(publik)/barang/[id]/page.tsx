import { HandHeart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoBarang } from "@/components/publik/info-barang";
import { InfoSedangDiklaim } from "@/components/publik/info-sedang-diklaim";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { kelasTombol } from "@/components/ui/tombol";
import { getBarangPublik } from "@/lib/queries/publik";
import { ROUTES } from "@/lib/routes";

export async function generateMetadata({ params }: PageProps<"/barang/[id]">): Promise<Metadata> {
  const barang = await getBarangPublik((await params).id);
  return { title: barang?.nama_barang ?? "Barang tidak ditemukan" };
}

export default async function DetailBarangPublik({ params }: PageProps<"/barang/[id]">) {
  const barang = await getBarangPublik((await params).id);
  if (!barang) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <TautanKembali href={ROUTES.beranda}>Kembali ke daftar barang</TautanKembali>
      <InfoBarang barang={barang} />

      <div className="md:ml-[calc(50%+0.75rem)]">
        {barang.bisa_diklaim ? (
          <div className="space-y-2">
            <Link href={ROUTES.klaimPublik(barang.id)} className={kelasTombol("utama", "w-full py-3 text-base")}>
              <HandHeart aria-hidden className="size-5" />
              Saya pemilik barang ini
            </Link>
            <p className="text-center text-xs text-muted">
              Anda akan diminta mengisi ciri-ciri barang untuk diverifikasi petugas.
            </p>
          </div>
        ) : (
          <InfoSedangDiklaim />
        )}
      </div>
    </main>
  );
}
