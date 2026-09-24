import { APLIKASI, INSTANSI } from "@/lib/aplikasi";
import { formatWaktu } from "@/lib/utils/tanggal";

/** Kop laporan yang HANYA tampil saat dicetak / disimpan sebagai PDF. */
export function KopCetak({ keterangan }: { keterangan: string[] }) {
  return (
    <header className="mb-6 hidden border-b-2 border-teks pb-3 print:block">
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG kecil, tidak perlu dioptimasi */}
      <img src="/logo-balai-yanpus.svg" alt="Balai Yanpus" width={224} height={42} className="h-9 w-auto" />
      <p className="mt-2 text-lg font-bold">Laporan {APLIKASI.nama}</p>
      <p className="text-sm">
        {INSTANSI.nama} · {INSTANSI.gedung}
      </p>
      <ul className="mt-1 text-xs">
        {keterangan.map((k) => (
          <li key={k}>{k}</li>
        ))}
        <li>Dicetak: {formatWaktu(new Date().toISOString())}</li>
      </ul>
    </header>
  );
}
