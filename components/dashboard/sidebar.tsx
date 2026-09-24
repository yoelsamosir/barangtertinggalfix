import Link from "next/link";
import type { Petugas } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { NavMenu } from "./nav-menu";
import { TombolLogout } from "./tombol-logout";

/** Isi panel navigasi petugas: logo, menu, identitas petugas, tombol keluar. */
export function Sidebar({ petugas, lencana }: { petugas: Petugas; lencana?: Record<string, number> }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href={ROUTES.dashboard} className="block px-3 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG kecil, tidak perlu dioptimasi */}
        <img src="/logo-balai-yanpus.svg" alt="Balai Yanpus" width={224} height={42} className="h-8 w-auto" />
        <span className="mt-2 block text-xs font-medium text-muted">Panel petugas</span>
      </Link>

      <div className="flex-1">
        <NavMenu lencana={lencana} />
      </div>

      <div className="space-y-2 border-t border-garis pt-4">
        <div className="px-3">
          <p className="truncate text-sm font-semibold">{petugas.nama}</p>
          {petugas.email && <p className="truncate text-xs text-muted">{petugas.email}</p>}
        </div>
        <TombolLogout />
      </div>
    </div>
  );
}
