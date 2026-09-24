import { LogIn } from "lucide-react";
import Link from "next/link";
import { kelasTombol } from "@/components/ui/tombol";
import { APLIKASI } from "@/lib/aplikasi";
import { ROUTES } from "@/lib/routes";

export function HeaderPublik() {
  return (
    <header className="border-b-4 border-aksen bg-permukaan">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={ROUTES.beranda} className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG kecil, tidak perlu dioptimasi */}
          <img src="/logo-balai-yanpus.svg" alt="Balai Yanpus" width={224} height={42} className="h-8 w-auto sm:h-10" />
          <span className="hidden border-l border-garis pl-3 leading-tight sm:block">
            <span className="block font-semibold">{APLIKASI.nama}</span>
            <span className="block text-xs text-muted">{APLIKASI.instansi}</span>
          </span>
        </Link>
        <Link href={ROUTES.login} className={kelasTombol("kedua", "shrink-0")}>
          <LogIn aria-hidden className="size-4" />
          Masuk petugas
        </Link>
      </div>
    </header>
  );
}
