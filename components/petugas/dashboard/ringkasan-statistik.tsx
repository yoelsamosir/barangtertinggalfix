import { ClipboardList, Hourglass, Package, PackageCheck } from "lucide-react";
import { KartuStatistik } from "@/components/ui/kartu-statistik";
import type { statistikDashboard } from "@/lib/queries/dashboard";
import { denganQuery, ROUTES } from "@/lib/routes";

type Statistik = Awaited<ReturnType<typeof statistikDashboard>>;

/** Empat angka utama; masing-masing membuka daftar yang sudah terfilter. */
export function RingkasanStatistik({ statistik }: { statistik: Statistik }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KartuStatistik
        label="Klaim menunggu verifikasi"
        nilai={Number(statistik.klaim_menunggu)}
        href={denganQuery(ROUTES.klaim, { status: "menunggu" })}
        ikon={ClipboardList}
        sorot={Number(statistik.klaim_menunggu) > 0}
      />
      <KartuStatistik
        label="Barang tersimpan"
        nilai={Number(statistik.barang_tersimpan)}
        href={denganQuery(ROUTES.barang, { status: "tersimpan" })}
        ikon={Package}
      />
      <KartuStatistik
        label="Menunggu diambil pemilik"
        nilai={Number(statistik.barang_diklaim)}
        href={denganQuery(ROUTES.barang, { status: "diklaim" })}
        ikon={Hourglass}
      />
      <KartuStatistik
        label="Sudah dikembalikan"
        nilai={Number(statistik.barang_dikembalikan)}
        href={denganQuery(ROUTES.barang, { status: "dikembalikan" })}
        ikon={PackageCheck}
      />
    </div>
  );
}
