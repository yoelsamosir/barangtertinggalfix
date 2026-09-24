import type { Metadata } from "next";
import { FilterPengembalianPetugas } from "@/components/petugas/pengembalian/filter-pengembalian";
import { TabelPengembalian } from "@/components/petugas/pengembalian/tabel-pengembalian";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { Paginasi } from "@/components/ui/paginasi";
import { parseHalaman } from "@/lib/pagination";
import { daftarPengembalian } from "@/lib/queries/pengembalian";
import { denganQuery, ROUTES } from "@/lib/routes";
import { filterPengembalianSchema } from "@/lib/validation/pengembalian";

export const metadata: Metadata = { title: "Pengembalian" };

export default async function DaftarPengembalian({ searchParams }: PageProps<"/dashboard/pengembalian">) {
  const params = await searchParams;
  const filter = filterPengembalianSchema.parse(params);
  const { pengembalian, total, halaman, jumlahHalaman } = await daftarPengembalian(
    filter,
    parseHalaman(params.halaman),
  );
  const adaFilter = Boolean(filter.dari || filter.sampai);

  return (
    <>
      <KepalaHalaman judul="Pengembalian">
        {total} barang telah diserahkan kepada pemiliknya{adaFilter ? " pada rentang ini" : ""}.
      </KepalaHalaman>
      <FilterPengembalianPetugas filter={filter} />
      <div className="space-y-4">
        <TabelPengembalian pengembalian={pengembalian} adaFilter={adaFilter} />
        <Paginasi
          halaman={halaman}
          jumlahHalaman={jumlahHalaman}
          href={(n) => denganQuery(ROUTES.pengembalian, { ...filter, halaman: n > 1 ? n : undefined })}
        />
      </div>
    </>
  );
}
