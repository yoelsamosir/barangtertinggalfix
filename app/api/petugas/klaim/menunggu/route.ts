import { responData, tangani } from "@/lib/api/respon";
import { ringkasanKlaimMenunggu } from "@/lib/queries/dashboard";

/** PETUGAS — GET /api/petugas/klaim/menunggu -> { jumlah, terbaru } (dipantau berkala untuk notifikasi) */
export async function GET() {
  return tangani(async () => responData(await ringkasanKlaimMenunggu()));
}
