import { BARIS_BARANG, BARIS_KLAIM, persenDikembalikan, type RingkasanLaporan } from "@/lib/laporan";

/**
 * Angka ringkasan untuk barang yang DITEMUKAN pada periode/filter, beserta
 * nasib klaim atas barang-barang itu. Satu angka utama: persentase dikembalikan.
 */
export function RingkasanLaporanPetugas({ ringkasan }: { ringkasan: RingkasanLaporan }) {
  const persen = persenDikembalikan(ringkasan);

  return (
    <section aria-labelledby="judul-ringkasan" className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <h2 id="judul-ringkasan" className="sr-only">
        Ringkasan
      </h2>

      <div className="flex flex-col justify-center rounded-xl border border-garis bg-permukaan p-5">
        <p className="text-sm text-muted">Berhasil dikembalikan</p>
        <p className="mt-1 text-5xl font-bold">{persen === null ? "—" : `${persen}%`}</p>
        <p className="mt-2 text-xs text-muted">
          {ringkasan.barang_dikembalikan} dari {ringkasan.barang_ditemukan} barang yang ditemukan pada periode ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DaftarAngka judul="Barang" baris={BARIS_BARANG} ringkasan={ringkasan} />
        <DaftarAngka judul="Klaim atas barang tersebut" baris={BARIS_KLAIM} ringkasan={ringkasan} />
      </div>
    </section>
  );
}

type PropsDaftar = { judul: string; baris: typeof BARIS_BARANG; ringkasan: RingkasanLaporan };

function DaftarAngka({ judul, baris, ringkasan }: PropsDaftar) {
  return (
    <div className="rounded-xl border border-garis bg-permukaan p-5">
      <h3 className="text-sm font-semibold">{judul}</h3>
      <dl className="mt-2 divide-y divide-garis text-sm">
        {baris.map(([kunci, label]) => (
          <div key={kunci} className="flex justify-between gap-3 py-2">
            <dt className="text-muted">{label}</dt>
            <dd className="font-semibold tabular-nums">{Number(ringkasan[kunci]).toLocaleString("id-ID")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
