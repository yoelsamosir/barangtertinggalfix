import type { Metadata } from "next";
import { FilterKlaimPetugas } from "@/components/petugas/klaim/filter-klaim";
import { TabelKlaim } from "@/components/petugas/klaim/tabel-klaim";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { Paginasi } from "@/components/ui/paginasi";
import { parseHalaman } from "@/lib/pagination";
import { daftarKlaim } from "@/lib/queries/klaim";
import { denganQuery, ROUTES } from "@/lib/routes";
import { filterKlaimSchema } from "@/lib/validation/klaim";

export const metadata: Metadata = { title: "Klaim" };

export default async function DaftarKlaim({ searchParams }: PageProps<"/dashboard/klaim">) {
  const params = await searchParams;
  const filter = filterKlaimSchema.parse(params);
  const { klaim, total, halaman, jumlahHalaman } = await daftarKlaim(filter, parseHalaman(params.halaman));
  const adaFilter = Boolean(filter.cari || filter.status);

  return (
    <>
      <KepalaHalaman judul="Klaim">
        {total} klaim{adaFilter ? " sesuai filter" : ""}. Buka klaim untuk mencocokkan keterangan dan memutuskan.
      </KepalaHalaman>
      <FilterKlaimPetugas filter={filter} />
      <div className="space-y-4">
        <TabelKlaim klaim={klaim} adaFilter={adaFilter} />
        <Paginasi
          halaman={halaman}
          jumlahHalaman={jumlahHalaman}
          href={(n) => denganQuery(ROUTES.klaim, { ...filter, halaman: n > 1 ? n : undefined })}
        />
      </div>
    </>
  );
}
