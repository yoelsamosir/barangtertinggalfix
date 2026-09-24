import type { Metadata } from "next";
import { MenuMobile } from "@/components/dashboard/menu-mobile";
import { Sidebar } from "@/components/dashboard/sidebar";
import { APLIKASI } from "@/lib/aplikasi";
import { requirePetugas } from "@/lib/auth";
import { jumlahKlaimMenunggu } from "@/lib/queries/klaim";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: `%s · Petugas · ${APLIKASI.nama}` },
  robots: { index: false, follow: false },
};

/**
 * Kerangka halaman petugas. requirePetugas() memastikan akun login DAN aktif
 * (proxy.ts hanya memeriksa ada tidaknya sesi).
 * Desktop: sidebar tetap di kiri. HP: bilah atas + laci menu.
 */
export default async function LayoutDashboard({ children }: LayoutProps<"/dashboard">) {
  const petugas = await requirePetugas();
  const lencana = { [ROUTES.klaim]: await jumlahKlaimMenunggu() };

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-garis bg-permukaan lg:block print:hidden">
        <Sidebar petugas={petugas} lencana={lencana} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MenuMobile judul={APLIKASI.nama}>
          <Sidebar petugas={petugas} lencana={lencana} />
        </MenuMobile>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
