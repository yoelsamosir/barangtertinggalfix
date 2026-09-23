"use server";

import { ambilFile, formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import * as layanan from "@/lib/services/pengembalian";
import { jalankan } from "./jalankan";

/** PETUGAS. Field: claim_id, foto (file dari kamera), persetujuan_foto, catatan */
export async function serahTerima(
  _prev: Hasil<{ return_id: string }> | null,
  formData: FormData,
): Promise<Hasil<{ return_id: string }>> {
  return jalankan(() => layanan.serahTerima(formToObject(formData), ambilFile(formData, "foto")));
}
