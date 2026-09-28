"use server";

import { formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import * as layanan from "@/lib/services/petugas";
import { jalankan } from "./jalankan";

/** Field: nama, email, password, peran */
export async function tambahPetugas(_prev: Hasil<{ id: string }> | null, formData: FormData) {
  return jalankan(() => layanan.tambahPetugas(formToObject(formData)));
}

/** Field: id, status (aktif | nonaktif) */
export async function ubahStatusPetugas(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.ubahStatusPetugas(formToObject(formData)));
}

/** Field: id, peran (petugas | admin) */
export async function aturPeranPetugas(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.aturPeranPetugas(formToObject(formData)));
}

/** Field: id, password_baru, konfirmasi_password */
export async function resetPasswordPetugas(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.resetPasswordPetugas(formToObject(formData)));
}
