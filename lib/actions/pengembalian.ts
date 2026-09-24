"use server";

import { redirect } from "next/navigation";
import { ambilFile, formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import { denganInfo, ROUTES } from "@/lib/routes";
import * as layanan from "@/lib/services/pengembalian";
import { jalankan } from "./jalankan";

/**
 * PETUGAS. Field: claim_id, foto (file dari kamera), persetujuan_foto, catatan.
 * Berhasil -> ke detail pengembalian yang baru dicatat.
 */
export async function serahTerima(
  _prev: Hasil<{ return_id: string }> | null,
  formData: FormData,
): Promise<Hasil<{ return_id: string }>> {
  const hasil = await jalankan(() => layanan.serahTerima(formToObject(formData), ambilFile(formData, "foto")));
  if (hasil.ok) redirect(denganInfo(ROUTES.pengembalianDetail(hasil.data.return_id), "baru"));
  return hasil;
}
