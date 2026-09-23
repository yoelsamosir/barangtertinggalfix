import "server-only";
import type { NextRequest } from "next/server";
import { ambilFile, formToObject } from "@/lib/form";
import { gagal, ok, type Hasil } from "@/lib/result";

/** Membaca request REST API. */

/** Sama dengan batas Server Action; foto maks 2 MB + field lain. */
const MAKS_BODY_BYTE = 3 * 1024 * 1024;

export type KonteksId = { params: Promise<{ id: string }> };

export type BodyRequest = {
  isian: Record<string, unknown>;
  file: (nama: string) => File | null;
};

/** Menerima JSON, atau multipart/form-data bila ada foto. */
export async function bacaBody(request: Request): Promise<Hasil<BodyRequest>> {
  if (Number(request.headers.get("content-length") ?? 0) > MAKS_BODY_BYTE) {
    return gagal("validasi", "Ukuran request maksimal 3 MB.");
  }

  const tipe = request.headers.get("content-type") ?? "";
  try {
    if (tipe.includes("multipart/form-data") || tipe.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      return ok({ isian: formToObject(formData), file: (nama) => ambilFile(formData, nama) });
    }

    const json: unknown = await request.json();
    if (typeof json !== "object" || json === null || Array.isArray(json)) {
      return gagal("validasi", "Body harus berupa objek JSON.");
    }
    return ok({ isian: json as Record<string, unknown>, file: () => null });
  } catch {
    return gagal("validasi", "Body request tidak dapat dibaca.");
  }
}

/** Query string -> objek (untuk divalidasi skema filter). */
export function queryParams(request: NextRequest): Record<string, string> {
  return Object.fromEntries(request.nextUrl.searchParams);
}
