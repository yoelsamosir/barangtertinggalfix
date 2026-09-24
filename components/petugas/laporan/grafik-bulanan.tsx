import { SelectFilter } from "@/components/filter/select-filter";
import { GrafikBatang } from "@/components/ui/grafik-batang";
import type { laporanPerBulan } from "@/lib/queries/laporan";
import { namaBulan } from "@/lib/utils/tanggal";

type BarisBulan = Awaited<ReturnType<typeof laporanPerBulan>>[number];

type Props = {
  data: BarisBulan[];
  tahun: number;
  /** Pilihan tahun + URL-nya (dibentuk di halaman agar filter lain ikut terbawa). */
  opsiTahun: { nilai: string; label: string; href: string }[];
};

/** Ditemukan vs dikembalikan per bulan dalam satu tahun, plus tabel angkanya. */
export function GrafikBulanan({ data, tahun, opsiTahun }: Props) {
  const bulanPendek = data.map((b) => namaBulan(b.bulan, "short"));
  const bulanPanjang = data.map((b) => namaBulan(b.bulan));
  const ditemukan = data.map((b) => Number(b.ditemukan));
  const dikembalikan = data.map((b) => Number(b.dikembalikan));
  const barisTabel = [
    { nama: "Ditemukan", nilai: ditemukan },
    { nama: "Dikembalikan", nilai: dikembalikan },
  ];

  return (
    <section aria-labelledby="judul-grafik" className="space-y-4 rounded-xl border border-garis bg-permukaan p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="judul-grafik" className="font-semibold">
            Per bulan tahun {tahun}
          </h2>
          <p className="text-xs text-muted">
            Mengikuti filter kategori. Periode &amp; lokasi di atas tidak berlaku untuk grafik ini.
          </p>
        </div>
        <div className="print:hidden">
          <SelectFilter label="Tahun" aktif={String(tahun)} opsi={opsiTahun} />
        </div>
      </div>

      <GrafikBatang
        label={bulanPendek}
        labelPanjang={bulanPanjang}
        seri={[
          { nama: "Ditemukan", warna: "bg-seri-1", nilai: ditemukan },
          { nama: "Dikembalikan", warna: "bg-seri-2", nilai: dikembalikan },
        ]}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-center text-xs tabular-nums">
          <caption className="sr-only">Jumlah barang ditemukan dan dikembalikan per bulan tahun {tahun}</caption>
          <thead className="text-muted">
            <tr>
              <th scope="col" className="py-1.5 text-left font-medium">
                Bulan
              </th>
              {bulanPendek.map((b, i) => (
                <th key={b} scope="col" className="py-1.5 font-medium">
                  <abbr title={bulanPanjang[i]} className="no-underline">
                    {b}
                  </abbr>
                </th>
              ))}
              <th scope="col" className="py-1.5 font-medium">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis border-t border-garis">
            {barisTabel.map(({ nama, nilai }) => (
              <tr key={nama}>
                <th scope="row" className="py-1.5 text-left font-medium">
                  {nama}
                </th>
                {nilai.map((n, i) => (
                  <td key={i} className="py-1.5">
                    {n}
                  </td>
                ))}
                <td className="py-1.5 font-semibold">{nilai.reduce((a, b) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
