import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { FotoBarang } from "@/components/barang/foto-barang";
import { KATEGORI_LABEL } from "@/lib/domain";
import type { BarangPublik } from "@/lib/queries/publik";
import { ROUTES } from "@/lib/routes";
import { formatTanggal } from "@/lib/utils/tanggal";
import { BadgeStatusPublik } from "./badge-status-publik";

export function KartuBarang({ barang }: { barang: BarangPublik }) {
  return (
    <Link
      href={ROUTES.barangPublik(barang.id)}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-garis bg-permukaan transition hover:border-brand/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-brand"
    >
      <FotoBarang
        url={barang.foto_url}
        nama={barang.nama_barang}
        kategori={barang.kategori}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">
            {KATEGORI_LABEL[barang.kategori]}
          </span>
          <BadgeStatusPublik status={barang.status_publik} />
        </div>
        <h3 className="font-semibold group-hover:text-brand">{barang.nama_barang}</h3>
        <dl className="mt-auto space-y-1 text-sm text-muted">
          <div className="flex gap-1.5">
            <dt className="sr-only">Lokasi ditemukan</dt>
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
            <dd>{barang.lokasi_ditemukan}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Tanggal ditemukan</dt>
            <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0" />
            <dd>{formatTanggal(barang.tanggal_ditemukan)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
