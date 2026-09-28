import {
  ChartColumn,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  PackageCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

/** Menu navigasi petugas. Urutan di sini = urutan tampil. `hanyaAdmin` = disembunyikan dari petugas biasa. */
export type ItemMenu = { label: string; href: string; ikon: LucideIcon; hanyaAdmin?: boolean };

export const MENU_DASHBOARD: ItemMenu[] = [
  { label: "Dashboard", href: ROUTES.dashboard, ikon: LayoutDashboard },
  { label: "Data Barang", href: ROUTES.barang, ikon: Package },
  { label: "Klaim", href: ROUTES.klaim, ikon: ClipboardCheck },
  { label: "Pengembalian", href: ROUTES.pengembalian, ikon: PackageCheck },
  { label: "Laporan", href: ROUTES.laporan, ikon: ChartColumn },
  { label: "Kelola Petugas", href: ROUTES.kelolaPetugas, ikon: UsersRound, hanyaAdmin: true },
  { label: "Profil", href: ROUTES.profil, ikon: UserRound },
];

/** Menu aktif bila path sama, atau berada di bawahnya (kecuali Dashboard yang harus sama persis). */
export function menuAktif(href: string, pathname: string): boolean {
  if (href === ROUTES.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
