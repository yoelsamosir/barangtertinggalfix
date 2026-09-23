import "server-only";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/routes";

/** Halaman mana yang harus di-refresh setelah data berubah. */

/** Data barang berubah: halaman publik + dashboard. */
export function revalidasiBarang(id: string) {
  revalidatePath(ROUTES.beranda);
  revalidatePath(ROUTES.barangPublik(id));
  revalidatePath(ROUTES.dashboard, "layout");
}

/** Klaim baru masuk: hanya dashboard petugas. */
export function revalidasiDashboard() {
  revalidatePath(ROUTES.dashboard, "layout");
}

/** Status klaim & barang berubah bersamaan (verifikasi / pengembalian). */
export function revalidasiSemua() {
  revalidatePath(ROUTES.beranda, "layout");
}
