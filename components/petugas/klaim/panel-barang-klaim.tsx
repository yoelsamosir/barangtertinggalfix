import Link from "next/link";
import { FotoBarang } from "@/components/barang/foto-barang";
import { KATEGORI_LABEL } from "@/lib/domain";
import { ROUTES } from "@/lib/routes";
import { BadgeStatusBarang } from "../barang/badge-status-barang";
import type { DetailKlaim } from "./perbandingan-klaim";

/** Ringkasan barang yang diklaim, dengan tautan ke detail barangnya. */
export function PanelBarangKlaim({ barang }: { barang: DetailKlaim["barang"] }) {
  return (
    <section aria-labelledby="judul-barang-klaim" className="rounded-xl border border-garis bg-permukaan p-5">
      <h2 id="judul-barang-klaim" className="mb-3 font-semibold">
        Barang yang diklaim
      </h2>
      <FotoBarang
        url={barang.foto_url}
        nama={barang.nama_barang}
        kategori={barang.kategori}
        className="aspect-[4/3] w-full rounded-lg border border-garis"
      />
      <div className="mt-3 space-y-1 text-sm">
        <p className="font-semibold">{barang.nama_barang}</p>
        <p className="font-mono text-xs text-muted">{barang.kode_barang}</p>
        <p className="text-muted">{KATEGORI_LABEL[barang.kategori]}</p>
        <BadgeStatusBarang status={barang.status} />
      </div>
      <Link
        href={ROUTES.barangDetail(barang.id)}
        className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
      >
        Lihat detail barang
      </Link>
    </section>
  );
}
