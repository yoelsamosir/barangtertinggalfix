import { Plus } from "lucide-react";
import Link from "next/link";
import { KlaimMenunggu } from "@/components/petugas/dashboard/klaim-menunggu";
import { RingkasanStatistik } from "@/components/petugas/dashboard/ringkasan-statistik";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { kelasTombol } from "@/components/ui/tombol";
import { getPetugas } from "@/lib/auth";
import { klaimMenungguTerbaru, statistikDashboard } from "@/lib/queries/dashboard";
import { ROUTES } from "@/lib/routes";

export default async function Dashboard() {
  const [petugas, statistik, klaim] = await Promise.all([getPetugas(), statistikDashboard(), klaimMenungguTerbaru(5)]);

  return (
    <>
      <KepalaHalaman
        judul={`Halo, ${petugas?.nama ?? "Petugas"}`}
        aksi={
          <Link href={ROUTES.barangTambah} className={kelasTombol()}>
            <Plus aria-hidden className="size-4" /> Tambah barang
          </Link>
        }
      >
        Ringkasan barang tertinggal dan klaim saat ini.
      </KepalaHalaman>

      <div className="space-y-6">
        <RingkasanStatistik statistik={statistik} />
        <KlaimMenunggu klaim={klaim} />
      </div>
    </>
  );
}
