"use server";

import { formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import * as layanan from "@/lib/services/akun";
import { jalankan } from "./jalankan";

/** Field: nama */
export async function ubahProfil(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.ubahProfil(formToObject(formData)));
}

/** Field: password_lama, password_baru, konfirmasi_password */
export async function gantiPassword(_prev: Hasil | null, formData: FormData): Promise<Hasil> {
  return jalankan(() => layanan.gantiPassword(formToObject(formData)));
}
