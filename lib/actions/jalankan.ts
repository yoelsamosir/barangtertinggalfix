import { redirect } from "next/navigation";
import { TidakBerwenangError } from "@/lib/errors";
import type { Hasil } from "@/lib/result";
import { ROUTES } from "@/lib/routes";

/**
 * Pembungkus Server Action: menjalankan use case, dan bila sesi petugas
 * sudah habis, mengarahkan ke halaman login.
 */
export async function jalankan<T>(usecase: () => Promise<Hasil<T>>): Promise<Hasil<T>> {
  try {
    return await usecase();
  } catch (error) {
    if (error instanceof TidakBerwenangError) redirect(ROUTES.login);
    throw error;
  }
}
