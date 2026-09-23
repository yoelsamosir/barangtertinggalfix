import type { NextRequest } from "next/server";
import { bacaBody, queryParams } from "@/lib/api/request";
import { respon, responData, tangani } from "@/lib/api/respon";
import { parseHalaman } from "@/lib/pagination";
import { daftarBarang } from "@/lib/queries/barang";
import { tambahBarang } from "@/lib/services/barang";
import { filterBarangSchema } from "@/lib/validation/barang";

/** PETUGAS — GET /api/petugas/barang?cari=&kategori=&status=&halaman= */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const q = queryParams(request);
    return responData(await daftarBarang(filterBarangSchema.parse(q), parseHalaman(q.halaman)));
  });
}

/** PETUGAS — POST /api/petugas/barang (multipart: field barang + foto opsional) */
export async function POST(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await tambahBarang(body.data.isian, body.data.file("foto")), 201);
  });
}
