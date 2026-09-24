import { SearchX } from "lucide-react";
import Link from "next/link";
import { ChipFilter } from "@/components/filter/chip-filter";
import { KolomCari } from "@/components/filter/kolom-cari";
import { KartuBarang } from "@/components/publik/kartu-barang";
import { ProsedurKlaim } from "@/components/publik/prosedur-klaim";
import { Paginasi } from "@/components/ui/paginasi";
import { APLIKASI } from "@/lib/aplikasi";
import { KATEGORI_LABEL, OPSI_KATEGORI } from "@/lib/domain";
import { parseHalaman } from "@/lib/pagination";
import { cariBarangPublik } from "@/lib/queries/publik";
import { denganQuery, ROUTES } from "@/lib/routes";
import { filterBarangPublikSchema, type FilterBarangPublik } from "@/lib/validation/barang";

export default async function Beranda({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filter = filterBarangPublikSchema.parse(params);
  const { barang, total, halaman, jumlahHalaman } = await cariBarangPublik(filter, parseHalaman(params.halaman));
  const adaFilter = Boolean(filter.cari || filter.kategori);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand">{APLIKASI.instansi}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{APLIKASI.nama}</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Kehilangan barang saat berkunjung ke perpustakaan? Cari barang Anda di sini, lalu ajukan klaim.
          </p>
        </div>
        <div className="space-y-4">
          <KolomCari
            action={ROUTES.beranda}
            nilai={filter.cari}
            label="Cari barang"
            placeholder="Contoh: dompet hitam, payung"
            pertahankan={{ kategori: filter.kategori }}
          />
          <ChipFilter
            label="Kategori"
            opsi={OPSI_KATEGORI}
            aktif={filter.kategori}
            href={(kategori) => denganQuery(ROUTES.beranda, { cari: filter.cari, kategori })}
          />
        </div>
      </section>

      <section aria-labelledby="judul-daftar" className="space-y-4">
        <h2 id="judul-daftar" className="text-lg font-semibold">
          {judulDaftar(filter)}
          <span className="ml-2 text-sm font-normal text-muted">({total} barang)</span>
        </h2>

        {barang.length === 0 ? (
          <HasilKosong adaFilter={adaFilter} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {barang.map((b) => (
              <li key={b.id} className="flex">
                <KartuBarang barang={b} />
              </li>
            ))}
          </ul>
        )}

        <Paginasi
          halaman={halaman}
          jumlahHalaman={jumlahHalaman}
          href={(n) => denganQuery(ROUTES.beranda, { ...filter, halaman: n > 1 ? n : undefined })}
        />
      </section>

      <ProsedurKlaim />
    </main>
  );
}

function judulDaftar(filter: FilterBarangPublik): string {
  const kategori = filter.kategori ? ` kategori ${KATEGORI_LABEL[filter.kategori]}` : "";
  if (filter.cari) return `Hasil pencarian “${filter.cari}”${kategori}`;
  return `Barang tertinggal${kategori}`;
}

function HasilKosong({ adaFilter }: { adaFilter: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-garis bg-permukaan px-6 py-12 text-center">
      <SearchX aria-hidden className="mx-auto size-10 text-muted" />
      <p className="mt-3 font-semibold">{adaFilter ? "Barang tidak ditemukan" : "Belum ada barang tertinggal"}</p>
      <p className="mt-1 text-sm text-muted">
        {adaFilter
          ? "Coba kata kunci lain atau pilih kategori “Semua”. Barang baru dapat ditambahkan petugas sewaktu-waktu."
          : "Saat ini tidak ada barang tertinggal yang tercatat."}
      </p>
      {adaFilter && (
        <Link href={ROUTES.beranda} className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Tampilkan semua barang
        </Link>
      )}
    </div>
  );
}
