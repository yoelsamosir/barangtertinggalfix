"use server";

import { redirect } from "next/navigation";
import type { Petugas } from "@/lib/auth";
import { formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import { PARAM_KEMBALI, ROUTES, tujuanSetelahLogin } from "@/lib/routes";
import * as layanan from "@/lib/services/auth";

/**
 * Field: email, password, cf-turnstile-response (widget Turnstile),
 * kembali (opsional: halaman petugas yang dibuka sebelum diminta login).
 */
export async function login(_prev: Hasil<Petugas> | null, formData: FormData): Promise<Hasil<Petugas>> {
  const hasil = await layanan.login(formToObject(formData));
  if (hasil.ok) redirect(tujuanSetelahLogin(formData.get(PARAM_KEMBALI)));
  return hasil;
}

export async function logout(): Promise<void> {
  await layanan.logout();
  redirect(ROUTES.login);
}
