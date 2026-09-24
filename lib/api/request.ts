import "server-only";
import type { NextRequest } from "next/server";
import { MAKS_BODY_REQUEST } from "@/lib/config";
import { ambilFile, formToObject } from "@/lib/form";
import { gagal, ok, type Hasil } from "@/lib/result";

/** Membaca request REST API. */

export type KonteksId = { params: Promise<{ id: string }> };

export type BodyRequest = {
  isian: Record<string, unknown>;
  file: (nama: string) => File | null;
};

/**
 * Menerima JSON, atau multipart/form-data bila ada foto.
 * Content-Length wajib, agar batas ukuran tidak bisa dilewati dengan
 * body "chunked" tanpa panjang.
 */
export async function bacaBody(request: Request): Promise<Hasil<BodyRequest>> {
  const panjang = request.headers.get("content-length");
  if (panjang === null) {
    return gagal("validasi", "Header Content-Length wajib dikirim.");
  }
  if (Number(panjang) > MAKS_BODY_REQUEST) {
    return gagal("validasi", "Ukuran request maksimal 4,5 MB.");
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
