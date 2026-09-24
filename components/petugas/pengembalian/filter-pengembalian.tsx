import Form from "next/form";
import Link from "next/link";
import { Tombol } from "@/components/ui/tombol";
import { ROUTES } from "@/lib/routes";
import { hariIniWIB } from "@/lib/utils/tanggal";
import type { FilterPengembalian } from "@/lib/validation/pengembalian";

const KELAS_TANGGAL =
  "h-10 rounded-lg border border-garis bg-permukaan px-3 text-sm focus:border-brand focus:outline-2 focus:outline-brand/30";

/** Rentang tanggal pengembalian (dari–sampai), disimpan di URL. */
export function FilterPengembalianPetugas({ filter }: { filter: FilterPengembalian }) {
  const hariIni = hariIniWIB();

  return (
    <Form action={ROUTES.pengembalian} className="mb-6 flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Dari tanggal</span>
        <input type="date" name="dari" defaultValue={filter.dari} max={hariIni} className={KELAS_TANGGAL} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Sampai tanggal</span>
        <input type="date" name="sampai" defaultValue={filter.sampai} max={hariIni} className={KELAS_TANGGAL} />
      </label>
      <Tombol type="submit" varian="kedua">
        Terapkan
      </Tombol>
      {(filter.dari || filter.sampai) && (
        <Link href={ROUTES.pengembalian} className="py-2 text-sm font-medium text-brand hover:underline">
          Hapus filter
        </Link>
      )}
    </Form>
  );
}
