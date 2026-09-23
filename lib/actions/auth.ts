"use server";

import { redirect } from "next/navigation";
import { formToObject } from "@/lib/form";
import type { Hasil } from "@/lib/result";
import { ROUTES } from "@/lib/routes";
import * as layanan from "@/lib/services/auth";
import type { Petugas } from "@/lib/auth";

/** Field: email, password, cf-turnstile-response (widget Turnstile) */
export async function login(_prev: Hasil<Petugas> | null, formData: FormData): Promise<Hasil<Petugas>> {
  const hasil = await layanan.login(formToObject(formData));
  if (hasil.ok) redirect(ROUTES.dashboard);
  return hasil;
}

export async function logout(): Promise<void> {
  await layanan.logout();
  redirect(ROUTES.login);
}
