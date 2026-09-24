import Form from "next/form";
import Link from "next/link";
import { Tombol } from "@/components/ui/tombol";
import { OPSI_KATEGORI } from "@/lib/domain";
import { ROUTES } from "@/lib/routes";
import { hariIniWIB } from "@/lib/utils/tanggal";
import type { FilterLaporan } from "@/lib/validation/laporan";

const KELAS_KONTROL =
  "h-10 w-full rounded-lg border border-garis bg-permukaan px-3 text-sm focus:border-brand focus:outline-2 focus:outline-brand/30";

/** Periode, kategori, dan lokasi laporan (disimpan di URL). Tahun grafik ikut dipertahankan. */
export function FilterLaporanPetugas({ filter, tahun }: { filter: FilterLaporan; tahun: number }) {
  const hariIni = hariIniWIB();
  const adaFilter = Boolean(filter.dari || filter.sampai || filter.kategori || filter.lokasi);

  return (
    <Form
      action={ROUTES.laporan}
      className="mb-6 grid gap-3 rounded-xl border border-garis bg-permukaan p-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end print:hidden"
    >
      <input type="hidden" name="tahun" value={tahun} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Ditemukan dari</span>
        <input type="date" name="dari" defaultValue={filter.dari} max={hariIni} className={KELAS_KONTROL} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Sampai</span>
        <input type="date" name="sampai" defaultValue={filter.sampai} max={hariIni} className={KELAS_KONTROL} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Kategori</span>
        <select name="kategori" defaultValue={filter.kategori ?? ""} className={KELAS_KONTROL}>
          <option value="">Semua kategori</option>
          {OPSI_KATEGORI.map((o) => (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Lokasi ditemukan</span>
        <input
          type="text"
          name="lokasi"
          defaultValue={filter.lokasi ?? ""}
          placeholder="Mis. Ruang Baca"
          maxLength={150}
          className={KELAS_KONTROL}
        />
      </label>
      <div className="flex items-center gap-3">
        <Tombol type="submit" varian="kedua">
          Terapkan
        </Tombol>
        {adaFilter && (
          <Link href={ROUTES.laporan} className="text-sm font-medium whitespace-nowrap text-brand hover:underline">
            Hapus filter
          </Link>
        )}
      </div>
    </Form>
  );
}
