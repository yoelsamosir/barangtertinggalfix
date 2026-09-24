import {
  ChartColumn,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  PackageCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

/** Menu navigasi petugas. Urutan di sini = urutan tampil. */
export type ItemMenu = { label: string; href: string; ikon: LucideIcon };

export const MENU_DASHBOARD: ItemMenu[] = [
  { label: "Dashboard", href: ROUTES.dashboard, ikon: LayoutDashboard },
  { label: "Data Barang", href: ROUTES.barang, ikon: Package },
  { label: "Klaim", href: ROUTES.klaim, ikon: ClipboardCheck },
  { label: "Pengembalian", href: ROUTES.pengembalian, ikon: PackageCheck },
  { label: "Laporan", href: ROUTES.laporan, ikon: ChartColumn },
  { label: "Profil", href: ROUTES.profil, ikon: UserRound },
];

/** Menu aktif bila path sama, atau berada di bawahnya (kecuali Dashboard yang harus sama persis). */
export function menuAktif(href: string, pathname: string): boolean {
  if (href === ROUTES.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
